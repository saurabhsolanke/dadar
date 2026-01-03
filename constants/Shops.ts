export interface Shop {
  id: string;
  name: string;
  image: string;
  d: string;
  rating: number;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export const SHOPS: Shop[] = [
  {
    id: '1',
    name: 'Kalashetra',
    image: 'https://content.jdmagicbox.com/comp/mumbai/e8/022pxx22.xx22.140214152636.h4e8/catalogue/kalashetra-dadar-west-mumbai-saree-retailers-3p0x1y1.jpg',
    d: '1.2 km from Dadar Station',
    rating: 4.5,
    description: 'Kalashetra is a renowned simplistic saree shop in Dadar known for its vast collection of traditional and modern silk sarees.',
    location: {
      latitude: 19.0178,
      longitude: 72.8478,
    },
  },
  {
    id: '2',
    name: 'Vama Silk',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6sV7gswv3o7f2Rk0Z2o7q0Z2o7q0Z2o7q0Q&s', // Placeholder or valid URL if found
    d: '1.2 km from Dadar Station',
    rating: 4.5,
    description: 'Vama Silk offers a premium range of silk sarees and ethnic wear for weddings and special occasions.',
    location: {
      latitude: 19.0180,
      longitude: 72.8480,
    },
  },
  {
    id: '3',
    name: 'Pramanik',
    image: 'https://content3.jdmagicbox.com/comp/mumbai/e3/022pxx22.xx22.180309133036.c6e3/catalogue/pramanik-dadar-west-mumbai-readymade-garment-retailers-2b2x6y6.jpg',
    d: '1.2 km from Dadar Station',
    rating: 4.5,
    description: 'Pramanik is a trusted name for family clothing, offering a wide variety of daily wear and festive collections.',
    location: {
      latitude: 19.0190,
      longitude: 72.8490,
    },
  },
  {
    id: '4',
    name: 'Dressline',
    image: 'https://content.jdmagicbox.com/comp/mumbai/j9/022pxx22.xx22.110625164102.k2j9/catalogue/dressline-dadar-west-mumbai-boutiques-fl2x4y4.jpg',
    d: '1.2 km from Dadar Station',
    rating: 4.5,
    description: 'Dressline is a popular boutique in Dadar known for its trendy kurtis, suits, and indo-western outfits.',
    location: {
      latitude: 19.0200,
      longitude: 72.8500,
    },
  },
  {
    id: '5',
    name: 'Dulha Paksh',
    image: 'https://content.jdmagicbox.com/comp/mumbai/u4/022pxx22.xx22.180216140524.l4u4/catalogue/dulha-paksh-dadar-west-mumbai-men-readymade-garment-retailers-1y2x7z7.jpg',
    d: '1.5 km from Dadar Station',
    rating: 4.2,
    description: 'Specializing in mens ethnic wear, Dulha Paksh is the go-to place for sherwanis, kurtas, and wedding attire.',
    location: {
      latitude: 19.0150,
      longitude: 72.8450,
    },
  },
  {
    id: '6',
    name: 'Nalli Silks',
    image: 'https://content.jdmagicbox.com/comp/mumbai/41/022p800441/catalogue/nalli-silk-sarees-dadar-west-mumbai-saree-retailers-2a2x8y8.jpg',
    d: '1.0 km from Dadar Station',
    rating: 4.8,
    description: 'A legendary name in silk sarees, Nalli Silks brings authentic Kanchipuram and other silk varieties to Dadar.',
    location: {
      latitude: 19.0210,
      longitude: 72.8510,
    },
  },
];
