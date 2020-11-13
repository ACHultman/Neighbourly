import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Platform } from 'react-native';
import { SearchBar, ListItem, ThemeProvider, colors } from 'react-native-elements';
import { Text, View } from '../components/Themed';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { useThemeColor, ThemeProps } from '../components/Themed'

interface ILocation {
  city: string,
  country: string,
  localized_country_name: string,
  state: string,
  name_string: string,
  zip: string,
  lat: number,
  lon: number
}



export default function TabOneScreen() {
  const theme = useColorScheme();
  const [search, setSearch] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
   
  function updateSearch (search: string) {
    setSearch(search);
    
  };

  useEffect(() => {
    console.log(`fetching search term ${search}...`)
    fetch(`https://api.meetup.com/find/locations?query=${search}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setData(json);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <View>
        <SearchBar
        placeholder="Enter your city..."
        onChangeText={updateSearch}
        value={search}
      />
      
      {isLoading ? <ActivityIndicator/> : (
            <FlatList
              data={data}
              keyExtractor={({ zip }, index) => zip}
              renderItem={({ item }: { item: ILocation}) => (
                <ListItem bottomDivider containerStyle={{backgroundColor: Colors[theme]['background']}}>
                <ListItem.Content>
                  <ListItem.Title style={{color: theme == 'dark' ? 'white':'black'}}>{item.name_string}</ListItem.Title>
                  <ListItem.Subtitle style={{color: theme == 'dark' ? 'white':'black'}}>{item.zip.startsWith('meetup') ? '' : item.zip}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
              )}
            />
          )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchBar: {
    width: '90%',
    height: 1,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
