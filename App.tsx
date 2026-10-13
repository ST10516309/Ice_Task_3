import { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Picker } from '@expo/ui/community/picker';

type Album = {
  id: string;
  title: string;
  artist: string;
  year: number;
  genre: string;
  rating: number;
};

const genres: string[] = [
  'Alternative',
  'Blues',
  'Classical',
  'Country',
  'Electronic',
  'Hip Hop',
  'Jazz',
  'Metal',
  'Pop',
  'R&B',
  'Reggae',
  'Rock',
  'Soundtrack',
  'Soul',
  'Other',
];

const MIN_TEXT_LENGTH = 2;
const MAX_TITLE_LENGTH = 50;
const MAX_ARTIST_LENGTH = 50;
const MIN_YEAR = 1900;
const MAX_RATING = 5;

export default function App() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');
  const [albums, setAlbums] = useState<Album[]>([]);

  const validateForm = (): boolean => {
    const trimmedTitle = title.trim();
    const trimmedArtist = artist.trim();
    const trimmedYear = year.trim();
    const trimmedRating = rating.trim();

    if (!trimmedTitle) {
      Alert.alert('Validation Error', 'Please enter an album title.');
      return false;
    }

    if (
      trimmedTitle.length < MIN_TEXT_LENGTH ||
      trimmedTitle.length > MAX_TITLE_LENGTH
    ) {
      Alert.alert(
        'Validation Error',
        `Album title must contain between ${MIN_TEXT_LENGTH} and ${MAX_TITLE_LENGTH} characters.`
      );
      return false;
    }

    if (!trimmedArtist) {
      Alert.alert('Validation Error', 'Please enter an artist name.');
      return false;
    }

    if (
      trimmedArtist.length < MIN_TEXT_LENGTH ||
      trimmedArtist.length > MAX_ARTIST_LENGTH
    ) {
      Alert.alert(
        'Validation Error',
        `Artist name must contain between ${MIN_TEXT_LENGTH} and ${MAX_ARTIST_LENGTH} characters.`
      );
      return false;
    }

    if (!/^\d{4}$/.test(trimmedYear)) {
      Alert.alert(
        'Validation Error',
        'Enter the release year as a four-digit year.'
      );
      return false;
    }

    const numericYear = Number(trimmedYear);
    const currentYear = new Date().getFullYear();

    if (numericYear < MIN_YEAR || numericYear > currentYear) {
      Alert.alert(
        'Validation Error',
        `Album year must be between ${MIN_YEAR} and ${currentYear}.`
      );
      return false;
    }

    if (!genres.includes(genre)) {
      Alert.alert('Validation Error', 'Please select a genre.');
      return false;
    }

    const numericRating = Number(trimmedRating);

    if (
      !/^\d+$/.test(trimmedRating) ||
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > MAX_RATING
    ) {
      Alert.alert(
        'Validation Error',
        `Rating must be a whole number from 1 to ${MAX_RATING}.`
      );
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const newAlbum: Album = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: title.trim(),
      artist: artist.trim(),
      year: Number(year),
      genre,
      rating: Number(rating),
    };

    setAlbums((currentAlbums) => [...currentAlbums, newAlbum]);

    setTitle('');
    setArtist('');
    setYear('');
    setGenre('');
    setRating('');
  };

  const handleDelete = (id: string) => {
    setAlbums((currentAlbums) =>
      currentAlbums.filter((album) => album.id !== id)
    );
  };

  const renderAlbum = ({ item }: { item: Album }) => (
    <View style={styles.albumCard}>
      <View style={styles.albumInformation}>
        <Text style={styles.albumTitle}>{item.title}</Text>
        <Text style={styles.albumArtist}>{item.artist}</Text>
        <Text>Year: {item.year}</Text>
        <Text>Genre: {item.genre}</Text>
        <Text>Rating: {item.rating}/5</Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
        accessibilityRole="button"
        accessibilityLabel={`Delete ${item.title}`}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={albums}
      keyExtractor={(item) => item.id}
      renderItem={renderAlbum}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View>
          <Text style={styles.heading}>My Album Collection</Text>

          <Text style={styles.label}>Album Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter album title"
            value={title}
            onChangeText={setTitle}
            maxLength={MAX_TITLE_LENGTH}
          />

          <Text style={styles.label}>Artist</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter artist name"
            value={artist}
            onChangeText={setArtist}
            maxLength={MAX_ARTIST_LENGTH}
          />

          <Text style={styles.label}>Year</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter release year"
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            maxLength={4}
          />

          <Text style={styles.label}>Genre</Text>
          <Picker
            selectedValue={genre}
            onValueChange={(value: string) => setGenre(value)}
          >
            <Picker.Item label="Select a genre..." value="" />
            {genres.map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>

          <Text style={styles.label}>Rating</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter rating from 1 to 5"
            value={rating}
            onChangeText={setRating}
            keyboardType="numeric"
            maxLength={1}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleSave}
            accessibilityRole="button"
          >
            <Text style={styles.addButtonText}>Add to Favourites</Text>
          </TouchableOpacity>

          <Text style={styles.collectionHeading}>
            My Favourite Albums ({albums.length})
          </Text>
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.emptyMessage}>No albums have been added yet.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2e7d32',
    borderRadius: 6,
    paddingVertical: 12,
    marginTop: 15,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  collectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  albumCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  albumInformation: {
    marginBottom: 10,
  },
  albumTitle: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  albumArtist: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 6,
  },
  deleteButton: {
    backgroundColor: '#c62828',
    borderRadius: 6,
    paddingVertical: 10,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#777777',
    marginTop: 20,
    fontStyle: 'italic',
  },
});