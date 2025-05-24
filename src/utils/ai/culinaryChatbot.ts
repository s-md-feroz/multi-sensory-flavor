
export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: ChatContext;
}

export interface ChatContext {
  currentRecipe?: string;
  cookingStep?: number;
  ingredients?: string[];
  dietaryRestrictions?: string[];
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  actions?: ChatAction[];
  context?: ChatContext;
}

export interface ChatAction {
  type: 'set_timer' | 'show_ingredient' | 'show_technique' | 'suggest_alternative';
  data: any;
}

export class CulinaryChatbot {
  private context: ChatContext = {};
  private conversationHistory: ChatMessage[] = [];

  async processMessage(userMessage: string): Promise<ChatResponse> {
    // Add user message to history
    this.addMessage('user', userMessage);

    // Analyze the message intent
    const intent = this.analyzeIntent(userMessage);
    
    // Generate contextual response
    const response = await this.generateResponse(userMessage, intent);
    
    // Add assistant message to history
    this.addMessage('assistant', response.message);
    
    return response;
  }

  private analyzeIntent(message: string): string {
    const intentPatterns = {
      cooking_help: ['how to cook', 'how do i', 'cooking', 'recipe', 'make'],
      ingredient_substitute: ['substitute', 'replace', 'instead of', 'alternative'],
      technique_question: ['technique', 'method', 'way to', 'best way'],
      timing_question: ['how long', 'when', 'time', 'timer'],
      nutrition_question: ['calories', 'nutrition', 'healthy', 'diet'],
      equipment_question: ['equipment', 'tool', 'pan', 'knife', 'oven'],
      general_food: ['food', 'taste', 'flavor', 'spice', 'season']
    };

    const lowerMessage = message.toLowerCase();
    
    for (const [intent, patterns] of Object.entries(intentPatterns)) {
      if (patterns.some(pattern => lowerMessage.includes(pattern))) {
        return intent;
      }
    }
    
    return 'general';
  }

  private async generateResponse(message: string, intent: string): Promise<ChatResponse> {
    switch (intent) {
      case 'cooking_help':
        return this.handleCookingHelp(message);
      
      case 'ingredient_substitute':
        return this.handleIngredientSubstitute(message);
      
      case 'technique_question':
        return this.handleTechniqueQuestion(message);
      
      case 'timing_question':
        return this.handleTimingQuestion(message);
      
      case 'nutrition_question':
        return this.handleNutritionQuestion(message);
      
      case 'equipment_question':
        return this.handleEquipmentQuestion(message);
      
      default:
        return this.handleGeneralQuestion(message);
    }
  }

  private handleCookingHelp(message: string): ChatResponse {
    const cookingTips = [
      "Start by prepping all your ingredients first - this is called 'mise en place'",
      "Taste as you go and adjust seasonings gradually",
      "Let meat rest after cooking for better texture",
      "Heat your pan before adding oil for better results"
    ];

    return {
      message: "I'd be happy to help you cook! " + cookingTips[Math.floor(Math.random() * cookingTips.length)],
      suggestions: [
        "Show me a basic recipe",
        "Help with cooking techniques",
        "Suggest ingredient substitutes",
        "Set a cooking timer"
      ],
      actions: [{
        type: 'show_technique',
        data: { technique: 'basic_cooking_tips' }
      }]
    };
  }

  private handleIngredientSubstitute(message: string): ChatResponse {
    const substitutes = {
      'butter': 'olive oil, coconut oil, or applesauce',
      'sugar': 'honey, maple syrup, or stevia',
      'eggs': 'flax eggs, applesauce, or mashed banana',
      'milk': 'almond milk, oat milk, or coconut milk',
      'flour': 'almond flour, coconut flour, or oat flour'
    };

    const ingredient = this.extractIngredient(message);
    const substitute = substitutes[ingredient.toLowerCase()] || 'similar ingredients with comparable flavor profiles';

    return {
      message: `For ${ingredient}, you can substitute with: ${substitute}. The ratio might vary, so start with less and adjust to taste.`,
      suggestions: [
        "More substitution ideas",
        "Check recipe compatibility",
        "Nutrition comparison"
      ],
      actions: [{
        type: 'suggest_alternative',
        data: { original: ingredient, alternatives: substitute }
      }]
    };
  }

  private handleTechniqueQuestion(message: string): ChatResponse {
    const techniques = {
      'sautéing': 'Cook quickly in a small amount of fat over high heat while stirring frequently',
      'braising': 'Brown meat first, then cook slowly in liquid at low temperature',
      'roasting': 'Cook in the oven with dry heat, perfect for larger cuts of meat and vegetables',
      'grilling': 'Cook over direct heat source, great for achieving char and smoky flavors'
    };

    const technique = Object.keys(techniques).find(t => message.toLowerCase().includes(t));
    const description = technique ? techniques[technique] : 'This depends on what you\'re trying to achieve. Could you be more specific?';

    return {
      message: `Here's how to ${technique || 'do that'}: ${description}`,
      suggestions: [
        "Show me step-by-step",
        "Common mistakes to avoid",
        "Alternative techniques"
      ]
    };
  }

  private handleTimingQuestion(message: string): ChatResponse {
    return {
      message: "Timing in cooking is crucial! For most proteins, use a meat thermometer for accuracy. Vegetables should be tender but still have some bite. Would you like me to set a timer for your current dish?",
      suggestions: [
        "Set a 10-minute timer",
        "Set a 20-minute timer",
        "Cooking time guidelines",
        "Temperature guide"
      ],
      actions: [{
        type: 'set_timer',
        data: { defaultTime: 15 }
      }]
    };
  }

  private handleNutritionQuestion(message: string): ChatResponse {
    return {
      message: "I can help with nutrition information! For accurate details, I'd recommend using a nutrition calculator with your specific ingredients and portions. Generally, focus on whole foods, balanced macros, and proper portion sizes.",
      suggestions: [
        "Healthy cooking tips",
        "Calorie estimation",
        "Nutritional substitutes"
      ]
    };
  }

  private handleEquipmentQuestion(message: string): ChatResponse {
    const equipment = {
      'knife': 'A sharp chef\'s knife is essential. Keep it sharp and use proper cutting technique.',
      'pan': 'A heavy-bottomed pan distributes heat evenly. Cast iron and stainless steel are great choices.',
      'oven': 'Preheat your oven and use an oven thermometer for accuracy.'
    };

    const tool = Object.keys(equipment).find(e => message.toLowerCase().includes(e));
    const advice = tool ? equipment[tool] : 'Quality equipment makes cooking easier, but technique matters more than expensive tools.';

    return {
      message: advice,
      suggestions: [
        "Essential kitchen tools",
        "Equipment maintenance",
        "Budget-friendly alternatives"
      ]
    };
  }

  private handleGeneralQuestion(message: string): ChatResponse {
    return {
      message: "I'm here to help with all your culinary questions! Whether you need cooking tips, recipe help, ingredient substitutions, or nutrition advice, just ask away.",
      suggestions: [
        "Help me cook something",
        "Suggest a recipe",
        "Cooking techniques",
        "Ingredient substitutes"
      ]
    };
  }

  private extractIngredient(message: string): string {
    const commonIngredients = ['butter', 'sugar', 'eggs', 'milk', 'flour', 'oil', 'salt', 'pepper'];
    const found = commonIngredients.find(ing => message.toLowerCase().includes(ing));
    return found || 'ingredient';
  }

  private addMessage(type: 'user' | 'assistant', content: string): void {
    const message: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      context: { ...this.context }
    };
    
    this.conversationHistory.push(message);
  }

  getConversationHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  updateContext(newContext: Partial<ChatContext>): void {
    this.context = { ...this.context, ...newContext };
  }
}
