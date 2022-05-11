import { View, StyleSheet, TouchableOpacity,Text, Dimensions, ImageBackground, Image, Alert  } from "react-native";
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {decrement} from '../redux/pointSlice';
import {useDispatch, useSelector} from 'react-redux';
import { images } from "../assets";

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;
const dataBackground = [images.background0, images.background1, images.background2, images.background3, images.background4, images.background5, images.background6, images.background7];

const Home = () => {
  const navigation = useNavigation();

  const points = useSelector(state => state.points);
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    console.log(points);
  },[]);

  const onClickStartButton = () => {
    if (points.value === 0) {
      Alert.alert('Please buy more turn');
      return false;
    }
    dispatch(decrement());
    setIndex(index + 1);
  }

  const onClickNextButton = () => {
    if(index === dataBackground.length - 1){
      Alert.alert(
        "End Notes!"
      );
      setIndex(0);
      return false;
    }
    setIndex(index + 1);
  }
  const onClickBackButton = () => {
    setIndex(index - 1);
  }

  const onClickTurnButton = () => {
    navigation.navigate("BUY");
  }


  return (
    <ImageBackground style={appStyle.homeView} source={dataBackground[index]}>
      { index === 0 && <TouchableOpacity onPress={onClickTurnButton} style={appStyle.turnView}>
        <View style={appStyle.turn}>
          <Text style={appStyle.turnText}>{points.value}</Text>
          <Image source={images.turn} style={appStyle.buyImage}/>
        </View>
      </TouchableOpacity>}
      {index === 0 ? (<TouchableOpacity
            onPress={onClickStartButton}
            style={appStyle.buttonStyle}>
              <Image source={images.start} style={appStyle.buttonStyle} />
        </TouchableOpacity>) : (
      <View style={appStyle.buttonView}>
        <TouchableOpacity
            onPress={onClickBackButton}>
              <Image source={images.back} style={appStyle.backStyle} />
        </TouchableOpacity>
        <TouchableOpacity
            onPress={onClickNextButton}>
              <Image source={images.next} style={appStyle.backStyle} />
        </TouchableOpacity>
      </View> )}
    </ImageBackground>
  );
};


export const appStyle = StyleSheet.create({
  homeView: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    resizeMode: 'cover',
  },
  turnView: {
    position: 'absolute',
    top: '5%',
    right: '0%',
    width: windowWidth * 0.2,
    marginRight: 10,
  },
  turn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  turnText: {
    fontSize: windowWidth > 640 ? 50 : 30,
    color: 'blue',
    fontFamily: 'AllerDisplay',
  },
  buyImage: {
    width: windowWidth * 0.1,
    height: windowWidth * 0.1,
    resizeMode: 'contain',
  },
  buttonView: {
    flex: 0.4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: windowHeight * 0.7,
  },
  backStyle: {
    width: windowWidth * 0.2,
    height: windowWidth * 0.2,
    resizeMode: 'contain',
  },
  buttonStyle: {
    width: windowWidth * 0.3,
    height: windowWidth * 0.3,
    resizeMode: 'contain',
    marginTop: windowHeight * 0.35,
  }
});

export default Home;