import { splitArtist } from './music-tag-loader';

const testData = [
  {
    artist: 'Test',
    expected: ['Test'],
  },
  {
    artist: 'Acivii ft. David Guetta',
    expected: ['Acivii', 'David Guetta'],
  },
  {
    artist: 'Daft Punk',
    expected: ['Daft Punk'],
  },
  {
    artist: 'David Guetta feat. Nicki Minaj & Flo Rida',
    expected: ['David Guetta', 'Nicki Minaj', 'Flo Rida'],
  },
];

describe('split artists', () => {
  testData.forEach((data) => {
    it(`Split ${data.artist} correctly`, () => {
      const actual = splitArtist(data.artist);
      expect(actual).toEqual(data.expected);
    });
  });
});
