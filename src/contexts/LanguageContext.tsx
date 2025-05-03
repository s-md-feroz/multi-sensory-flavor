
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Available languages
export type Language = 'English' | 'हिन्दी' | 'Español' | 'Français' | '日本語';

// Language context type
type LanguageContextType = {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Default language context
const defaultLanguageContext: LanguageContextType = {
  currentLanguage: 'English',
  setLanguage: () => {},
  t: (key: string) => key,
};

// Create the context
export const LanguageContext = createContext<LanguageContextType>(defaultLanguageContext);

// Language provider props
interface LanguageProviderProps {
  children: ReactNode;
}

// All translations
export const translations: Record<Language, Record<string, string>> = {
  "English": {
    // Common translations
    share: "Share",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    loading: "Loading...",
    search: "Search",
    
    // Page titles
    flavorBuilderTitle: "Flavor Builder",
    flavorBuilderDescription: "Create unique flavor combinations using the science of multisensory design",
    sensoryJournalTitle: "Your Sensory Journal",
    sensoryJournalDescription: "Capture, organize, and revisit your multisensory flavor experiences",
    
    // Navigation
    home: "Home",
    flavorBuilder: "Flavor Builder",
    moodBoard: "Mood Board",
    challenges: "Challenges",
    sensoryJournal: "Sensory Journal",
    
    // Sensory Journal tabs
    timeline: "Timeline",
    mood: "Mood Flavors",
    speech: "Voice Log",
    scan: "Scan Meal",
    audioCues: "Audio Cues",
    languageOptions: "Language Options",
    languageDescription: "Log your sensory experiences in multiple languages",
    
    // Flavor Builder
    filteredIngredients: "Filtered Ingredients",
    selectedIngredients: "Selected Ingredients",
    clearAll: "Clear All",
    saveFlavorCombination: "Save Flavor Combination",
    recommendedCombinations: "Recommended Combinations",
    tryThis: "Try This"
  },
  "हिन्दी": {
    // Common translations
    share: "साझा करें",
    save: "सहेजें",
    cancel: "रद्द करें",
    delete: "हटाएं",
    edit: "संपादित करें",
    loading: "लोड हो रहा है...",
    search: "खोज",
    
    // Page titles
    flavorBuilderTitle: "फ्लेवर बिल्डर",
    flavorBuilderDescription: "बहुसंवेदी डिज़ाइन के विज्ञान का उपयोग करके अनोखे स्वाद संयोजन बनाएं",
    sensoryJournalTitle: "आपकी संवेदी डायरी",
    sensoryJournalDescription: "अपने बहुसंवेदी स्वाद अनुभवों को कैप्चर करें, व्यवस्थित करें और फिर से देखें",
    
    // Navigation
    home: "होम",
    flavorBuilder: "फ्लेवर बिल्डर",
    moodBoard: "मूड बोर्ड",
    challenges: "चुनौतियां",
    sensoryJournal: "संवेदी डायरी",
    
    // Sensory Journal tabs
    timeline: "टाइमलाइन",
    mood: "मूड फ्लेवर्स",
    speech: "वॉइस लॉग",
    scan: "भोजन स्कैन करें",
    audioCues: "ऑडियो संकेत",
    languageOptions: "भाषा विकल्प",
    languageDescription: "कई भाषाओं में अपने संवेदी अनुभवों को लॉग करें",
    
    // Flavor Builder
    filteredIngredients: "फ़िल्टर किए गए सामग्री",
    selectedIngredients: "चयनित सामग्री",
    clearAll: "सभी हटाएं",
    saveFlavorCombination: "स्वाद संयोजन सहेजें",
    recommendedCombinations: "अनुशंसित संयोजन",
    tryThis: "इसे आज़माएं"
  },
  "Español": {
    // Common translations
    share: "Compartir",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    loading: "Cargando...",
    search: "Buscar",
    
    // Page titles
    flavorBuilderTitle: "Constructor de Sabores",
    flavorBuilderDescription: "Crea combinaciones de sabores únicas utilizando la ciencia del diseño multisensorial",
    sensoryJournalTitle: "Tu Diario Sensorial",
    sensoryJournalDescription: "Captura, organiza y revive tus experiencias de sabor multisensoriales",
    
    // Navigation
    home: "Inicio",
    flavorBuilder: "Constructor de Sabores",
    moodBoard: "Tablero de Humor",
    challenges: "Desafíos",
    sensoryJournal: "Diario Sensorial",
    
    // Sensory Journal tabs
    timeline: "Cronología",
    mood: "Sabores de Humor",
    speech: "Registro de Voz",
    scan: "Escanear Comida",
    audioCues: "Señales de Audio",
    languageOptions: "Opciones de Idioma",
    languageDescription: "Registra tus experiencias sensoriales en varios idiomas",
    
    // Flavor Builder
    filteredIngredients: "Ingredientes Filtrados",
    selectedIngredients: "Ingredientes Seleccionados",
    clearAll: "Limpiar Todo",
    saveFlavorCombination: "Guardar Combinación de Sabores",
    recommendedCombinations: "Combinaciones Recomendadas",
    tryThis: "Prueba Esto"
  },
  "Français": {
    // Common translations
    share: "Partager",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    loading: "Chargement...",
    search: "Rechercher",
    
    // Page titles
    flavorBuilderTitle: "Constructeur de Saveurs",
    flavorBuilderDescription: "Créez des combinaisons de saveurs uniques en utilisant la science de la conception multisensorielle",
    sensoryJournalTitle: "Votre Journal Sensoriel",
    sensoryJournalDescription: "Capturez, organisez et revisitez vos expériences gustatives multisensorielles",
    
    // Navigation
    home: "Accueil",
    flavorBuilder: "Constructeur de Saveurs",
    moodBoard: "Tableau d'Humeur",
    challenges: "Défis",
    sensoryJournal: "Journal Sensoriel",
    
    // Sensory Journal tabs
    timeline: "Chronologie",
    mood: "Saveurs d'Humeur",
    speech: "Journal Vocal",
    scan: "Scanner le Repas",
    audioCues: "Repères Audio",
    languageOptions: "Options de Langue",
    languageDescription: "Enregistrez vos expériences sensorielles dans plusieurs langues",
    
    // Flavor Builder
    filteredIngredients: "Ingrédients Filtrés",
    selectedIngredients: "Ingrédients Sélectionnés",
    clearAll: "Tout Effacer",
    saveFlavorCombination: "Enregistrer la Combinaison de Saveurs",
    recommendedCombinations: "Combinaisons Recommandées",
    tryThis: "Essayez Ceci"
  },
  "日本語": {
    // Common translations
    share: "共有",
    save: "保存",
    cancel: "キャンセル",
    delete: "削除",
    edit: "編集",
    loading: "読み込み中...",
    search: "検索",
    
    // Page titles
    flavorBuilderTitle: "フレーバービルダー",
    flavorBuilderDescription: "多感覚デザインの科学を使用して、ユニークなフレーバーの組み合わせを作成します",
    sensoryJournalTitle: "あなたの感覚ジャーナル",
    sensoryJournalDescription: "多感覚の味わい体験を記録し、整理し、再訪します",
    
    // Navigation
    home: "ホーム",
    flavorBuilder: "フレーバービルダー",
    moodBoard: "ムードボード",
    challenges: "チャレンジ",
    sensoryJournal: "感覚ジャーナル",
    
    // Sensory Journal tabs
    timeline: "タイムライン",
    mood: "ムードフレーバー",
    speech: "ボイスログ",
    scan: "食事をスキャン",
    audioCues: "オーディオキュー",
    languageOptions: "言語オプション",
    languageDescription: "複数の言語であなたの感覚体験を記録する",
    
    // Flavor Builder
    filteredIngredients: "フィルタリングされた材料",
    selectedIngredients: "選択された材料",
    clearAll: "すべてクリア",
    saveFlavorCombination: "フレーバーの組み合わせを保存",
    recommendedCombinations: "おすすめの組み合わせ",
    tryThis: "これを試す"
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('English');

  // Translation function
  const translate = (key: string): string => {
    const currentTranslations = translations[currentLanguage];
    
    // Return the translation or the key itself if not found
    return currentTranslations && currentTranslations[key]
      ? currentTranslations[key]
      : translations.English[key] || key;
  };

  const value = {
    currentLanguage,
    setLanguage: (language: Language) => setCurrentLanguage(language),
    t: translate,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
