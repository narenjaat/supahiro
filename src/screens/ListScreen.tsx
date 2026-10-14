import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Character, fetchCharacters } from '../api';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;
type Status = 'loading' | 'refreshing' | 'idle';

export default function ListScreen({ navigation }: Props) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (next: Status) => {
    setStatus(next);
    setError(null);
    try {
      setCharacters(await fetchCharacters());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setStatus('idle');
    }
  }, []);

  useEffect(() => {
    load('loading');
  }, [load]);

  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && characters.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Pressable style={styles.button} onPress={() => load('loading')}>
          <Text style={styles.buttonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={characters}
      keyExtractor={(item) => String(item.id)}
      refreshing={status === 'refreshing'}
      onRefresh={() => load('refreshing')}
      ListHeaderComponent={error ? <Text style={styles.banner}>{error}</Text> : null}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          onPress={() => navigation.navigate('Detail', { character: item })}
        >
          <Image source={{ uri: item.image }} style={styles.avatar} />
          <View style={styles.rowText}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.status} · {item.species}
            </Text>
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  error: { color: '#b00020', textAlign: 'center', marginBottom: 16 },
  banner: { color: '#b00020', textAlign: 'center', padding: 12, backgroundColor: '#fdecea' },
  button: { backgroundColor: '#1a73e8', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff' },
  rowPressed: { backgroundColor: '#f2f2f2' },
  rowText: { flex: 1 },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 12 },
  name: { fontSize: 16, fontWeight: '600' },
  meta: { color: '#666', marginTop: 2 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: '#ddd' },
});
