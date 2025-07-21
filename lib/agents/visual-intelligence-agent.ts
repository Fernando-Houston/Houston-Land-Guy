import Replicate from 'replicate';

interface PropertyAnalysis {
  conditionScore: number;
  features: string[];
  issues: string[];
  renovationEstimate: number;
  description: string;
}

interface ConstructionDetection {
  hasConstruction: boolean;
  constructionType: string[];
  equipmentDetected: string[];
  confidenceScore: number;
}

interface DocumentOCR {
  text: string;
  permitNumber?: string;
  issueDate?: string;
  permitType?: string;
  address?: string;
  contractor?: string;
}

interface SatelliteAnalysis {
  landUse: string;
  vegetationCoverage: number;
  developmentStage: string;
  changesDetected: boolean;
  changeDescription?: string;
}

export class VisualIntelligenceAgent {
  private replicate: Replicate;
  
  constructor() {
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }

  async analyzePropertyPhoto(imageUrl: string): Promise<PropertyAnalysis> {
    try {
      const output = await this.replicate.run(
        "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
        {
          input: {
            image: imageUrl,
            question: "Describe this property's condition, features, and any visible issues or needed repairs in detail.",
          }
        }
      );

      const description = String(output);
      
      const llavaOutput = await this.replicate.run(
        "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
        {
          input: {
            image: imageUrl,
            question: "Analyze this property photo and list: 1) Key features (e.g., garage, pool, landscaping) 2) Visible issues or needed repairs 3) Overall condition score from 1-10 4) Estimated renovation cost range",
          }
        }
      );
      
      const analysis = String(llavaOutput);
      
      const conditionScore = this.extractConditionScore(analysis);
      const features = this.extractFeatures(analysis);
      const issues = this.extractIssues(analysis);
      const renovationEstimate = this.extractRenovationEstimate(analysis);

      return {
        conditionScore,
        features,
        issues,
        renovationEstimate,
        description: description + "\n\nDetailed Analysis:\n" + analysis
      };
    } catch (error) {
      console.error('Property photo analysis error:', error);
      throw new Error(`Failed to analyze property photo: ${error.message}`);
    }
  }

  async detectConstruction(imageUrl: string): Promise<ConstructionDetection> {
    try {
      const output = await this.replicate.run(
        "daanelson/yolov8:19923e7c76e20f4ba470ac71e96016e3d37a92dcbedd4992e7b9e8529e2eff85",
        {
          input: {
            image: imageUrl,
            confidence_threshold: 0.4,
            iou_threshold: 0.5,
          }
        }
      );

      // YOLOv8 returns an array of detections
      const detections = Array.isArray(output) ? output : (output?.detections || []);
      
      const constructionKeywords = ['truck', 'excavator', 'crane', 'person', 'car', 'vehicle'];
      const constructionDetected = detections.filter((det: any) => {
        const className = det.class || det.label || '';
        return constructionKeywords.some(keyword => 
          className.toLowerCase().includes(keyword)
        );
      });

      const hasConstruction = constructionDetected.length > 0;
      const equipmentDetected = [...new Set(constructionDetected.map((det: any) => det.class || det.label))];
      
      const visualAnalysis = await this.replicate.run(
        "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
        {
          input: {
            image: imageUrl,
            question: "Is there any construction activity, equipment, or development work visible in this image? Describe what you see.",
          }
        }
      );

      const constructionType = this.inferConstructionType(String(visualAnalysis), equipmentDetected);
      
      return {
        hasConstruction,
        constructionType,
        equipmentDetected,
        confidenceScore: hasConstruction ? Math.max(...constructionDetected.map((d: any) => d.confidence || d.score || 0)) : 0
      };
    } catch (error) {
      console.error('Construction detection error:', error);
      throw new Error(`Failed to detect construction: ${error.message}`);
    }
  }

  async performDocumentOCR(imageUrl: string): Promise<DocumentOCR> {
    try {
      const output = await this.replicate.run(
        "abubakar-ucr/trocr-base-printed:3cfa96b6f6e12db356013b33c7c09ca9c9b10bdfaece18fab3cf96ac0093aa4a",
        {
          input: {
            image: imageUrl
          }
        }
      );

      const text = String(output).trim();
      
      const permitData = this.extractPermitData(text);

      return {
        text,
        ...permitData
      };
    } catch (error) {
      console.error('Document OCR error:', error);
      throw new Error(`Failed to perform OCR: ${error.message}`);
    }
  }

  async analyzeSatelliteImage(imageUrl: string, previousImageUrl?: string): Promise<SatelliteAnalysis> {
    try {
      const currentAnalysis = await this.replicate.run(
        "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
        {
          input: {
            image: imageUrl,
            question: "Describe the land use, vegetation coverage, and development stage visible in this satellite/aerial image.",
          }
        }
      );

      const analysis = String(currentAnalysis);
      
      let changesDetected = false;
      let changeDescription: string | undefined;

      if (previousImageUrl) {
        const changeAnalysis = await this.replicate.run(
          "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
          {
            input: {
              image: imageUrl,
              question: `Compare this image to what might have been here before. What changes in development, construction, or land use are visible?`,
            }
          }
        );
        
        changeDescription = String(changeAnalysis);
        changesDetected = changeDescription.toLowerCase().includes('change') || 
                         changeDescription.toLowerCase().includes('new') ||
                         changeDescription.toLowerCase().includes('development');
      }

      return {
        landUse: this.extractLandUse(analysis),
        vegetationCoverage: this.extractVegetationCoverage(analysis),
        developmentStage: this.extractDevelopmentStage(analysis),
        changesDetected,
        changeDescription
      };
    } catch (error) {
      console.error('Satellite image analysis error:', error);
      throw new Error(`Failed to analyze satellite image: ${error.message}`);
    }
  }

  async processMultipleImages(imageUrls: string[], analysisType: 'property' | 'construction' | 'satellite' | 'document') {
    const promises = imageUrls.map(url => {
      switch (analysisType) {
        case 'property':
          return this.analyzePropertyPhoto(url);
        case 'construction':
          return this.detectConstruction(url);
        case 'satellite':
          return this.analyzeSatelliteImage(url);
        case 'document':
          return this.performDocumentOCR(url);
        default:
          throw new Error(`Unknown analysis type: ${analysisType}`);
      }
    });

    return Promise.all(promises);
  }

  private extractConditionScore(analysis: string): number {
    const match = analysis.match(/condition\s*score[:\s]*(\d+)/i) || 
                  analysis.match(/score[:\s]*(\d+)/i) ||
                  analysis.match(/(\d+)\s*\/\s*10/i);
    return match ? parseInt(match[1]) : 5;
  }

  private extractFeatures(analysis: string): string[] {
    const features = [];
    const featureKeywords = ['garage', 'pool', 'patio', 'deck', 'fence', 'landscaping', 'driveway', 'windows', 'roof', 'siding', 'garden', 'trees'];
    
    featureKeywords.forEach(keyword => {
      if (analysis.toLowerCase().includes(keyword)) {
        features.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    });

    const match = analysis.match(/features?[:\s]*(.*?)(?:\n|$)/i);
    if (match) {
      const additionalFeatures = match[1].split(/[,;]/).map(f => f.trim()).filter(f => f.length > 0);
      features.push(...additionalFeatures);
    }

    return [...new Set(features)];
  }

  private extractIssues(analysis: string): string[] {
    const issues = [];
    const issueKeywords = ['damage', 'repair', 'crack', 'leak', 'rust', 'rot', 'mold', 'peeling', 'broken', 'missing', 'worn', 'old', 'outdated'];
    
    const sentences = analysis.split(/[.!?]/);
    sentences.forEach(sentence => {
      if (issueKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
        issues.push(sentence.trim());
      }
    });

    return issues.filter(issue => issue.length > 10);
  }

  private extractRenovationEstimate(analysis: string): number {
    const match = analysis.match(/\$([0-9,]+)/);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''));
    }
    
    if (analysis.toLowerCase().includes('minor') || analysis.toLowerCase().includes('small')) {
      return 10000;
    } else if (analysis.toLowerCase().includes('major') || analysis.toLowerCase().includes('extensive')) {
      return 75000;
    }
    
    return 25000;
  }

  private inferConstructionType(description: string, equipment: string[]): string[] {
    const types = [];
    
    if (description.toLowerCase().includes('residential') || equipment.includes('person')) {
      types.push('Residential Construction');
    }
    if (description.toLowerCase().includes('commercial') || equipment.includes('crane')) {
      types.push('Commercial Development');
    }
    if (description.toLowerCase().includes('road') || description.toLowerCase().includes('infrastructure')) {
      types.push('Infrastructure');
    }
    if (equipment.includes('excavator')) {
      types.push('Excavation/Site Preparation');
    }
    
    return types.length > 0 ? types : ['General Construction'];
  }

  private extractPermitData(text: string) {
    const permitNumber = text.match(/permit\s*#?\s*:?\s*([A-Z0-9-]+)/i)?.[1];
    const issueDate = text.match(/date[:\s]*([\d\/\-]+)/i)?.[1];
    const permitType = text.match(/type[:\s]*([^\n]+)/i)?.[1]?.trim();
    const address = text.match(/address[:\s]*([^\n]+)/i)?.[1]?.trim();
    const contractor = text.match(/contractor[:\s]*([^\n]+)/i)?.[1]?.trim();

    return {
      permitNumber,
      issueDate,
      permitType,
      address,
      contractor
    };
  }

  private extractLandUse(analysis: string): string {
    if (analysis.toLowerCase().includes('residential')) return 'Residential';
    if (analysis.toLowerCase().includes('commercial')) return 'Commercial';
    if (analysis.toLowerCase().includes('industrial')) return 'Industrial';
    if (analysis.toLowerCase().includes('agricultural')) return 'Agricultural';
    if (analysis.toLowerCase().includes('vacant') || analysis.toLowerCase().includes('undeveloped')) return 'Vacant/Undeveloped';
    return 'Mixed Use';
  }

  private extractVegetationCoverage(analysis: string): number {
    const match = analysis.match(/(\d+)\s*%?\s*(?:vegetation|green|trees)/i);
    if (match) return parseInt(match[1]);
    
    if (analysis.toLowerCase().includes('dense') || analysis.toLowerCase().includes('heavily')) return 75;
    if (analysis.toLowerCase().includes('moderate')) return 50;
    if (analysis.toLowerCase().includes('sparse') || analysis.toLowerCase().includes('little')) return 25;
    
    return 40;
  }

  private extractDevelopmentStage(analysis: string): string {
    if (analysis.toLowerCase().includes('complete')) return 'Completed';
    if (analysis.toLowerCase().includes('construction')) return 'Under Construction';
    if (analysis.toLowerCase().includes('planning') || analysis.toLowerCase().includes('proposed')) return 'Planning';
    if (analysis.toLowerCase().includes('vacant') || analysis.toLowerCase().includes('undeveloped')) return 'Undeveloped';
    return 'Established';
  }
}