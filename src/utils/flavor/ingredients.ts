
import { Ingredient } from './types';

// Sample ingredients database
export const ingredients: Ingredient[] = [
  {
    id: '1',
    name: 'Strawberry',
    description: 'Sweet and slightly tart with a juicy texture',
    image: '/strawberry.jpg',
    taste: ['sweet', 'sour'],
    smell: ['fruity', 'floral'],
    texture: ['smooth', 'tender'],
    sound: ['silent'],
    visual: ['vibrant', 'colorful'],
    moods: ['romantic', 'refreshing', 'energizing']
  },
  {
    id: '2',
    name: 'Dark Chocolate',
    description: 'Intensely rich with bitter notes and hints of sweetness',
    image: '/chocolate.jpg',
    taste: ['bitter', 'sweet'],
    smell: ['earthy', 'woody'],
    texture: ['smooth', 'creamy'],
    sound: ['snappy'],
    visual: ['monochromatic', 'glossy'],
    moods: ['cozy', 'romantic']
  },
  {
    id: '3',
    name: 'Sea Salt',
    description: 'Pure briny taste with mineral complexity',
    image: '/salt.jpg',
    taste: ['salty'],
    smell: [],
    texture: ['crispy'],
    sound: ['crunchy'],
    visual: ['monochromatic', 'matte'],
    moods: ['adventurous']
  },
  {
    id: '4',
    name: 'Cinnamon',
    description: 'Warm spice with sweet and woody notes',
    image: '/cinnamon.jpg',
    taste: ['sweet', 'bitter'],
    smell: ['spicy', 'woody'],
    texture: [],
    sound: [],
    visual: ['monochromatic'],
    moods: ['cozy', 'energizing']
  },
  {
    id: '5',
    name: 'Lime',
    description: 'Bright citrus with intense sourness and aromatic oils',
    image: '/lime.jpg',
    taste: ['sour'],
    smell: ['fruity', 'herbal'],
    texture: ['juicy'],
    sound: [],
    visual: ['vibrant', 'colorful'],
    moods: ['refreshing', 'energizing', 'adventurous']
  },
  {
    id: '6',
    name: 'Mushroom',
    description: 'Earthy with deep savory notes',
    image: '/mushroom.jpg',
    taste: ['umami'],
    smell: ['earthy'],
    texture: ['tender', 'chewy'],
    sound: [],
    visual: ['monochromatic'],
    moods: ['cozy', 'adventurous']
  },
  {
    id: '7',
    name: 'Honey',
    description: 'Floral sweetness with complex aromatics',
    image: '/honey.jpg',
    taste: ['sweet'],
    smell: ['floral', 'fruity'],
    texture: ['smooth'],
    sound: [],
    visual: ['glossy', 'vibrant'],
    moods: ['calming', 'cozy', 'romantic']
  },
  {
    id: '8',
    name: 'Potato Chips',
    description: 'Salty with a satisfying crunch',
    image: '/chips.jpg',
    taste: ['salty'],
    smell: ['earthy'],
    texture: ['crispy', 'crunchy'],
    sound: ['crunchy', 'snappy'],
    visual: ['patterned', 'colorful'],
    moods: ['energizing']
  },
  {
    id: '9',
    name: 'Basil',
    description: 'Aromatic herb with sweet and peppery notes',
    image: '/basil.jpg',
    taste: ['bitter'],
    smell: ['herbal', 'spicy'],
    texture: [],
    sound: [],
    visual: ['vibrant'],
    moods: ['refreshing', 'energizing']
  },
  {
    id: '10',
    name: 'Bacon',
    description: 'Savory, smoky and salty with a rich aroma',
    image: '/bacon.jpg',
    taste: ['salty', 'umami'],
    smell: ['smoky', 'woody'],
    texture: ['crispy', 'chewy'],
    sound: ['crunchy', 'sizzling'],
    visual: ['patterned'],
    moods: ['cozy', 'adventurous']
  }
];
