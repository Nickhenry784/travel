/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

import RNIap, {
  purchaseUpdatedListener,
  finishTransaction,
} from 'react-native-iap';
import {useDispatch} from 'react-redux';
import {items} from '../conf';
import {increamentByAmount} from '../redux/pointSlice';

let purchaseUpdateSubscription = null;
let purchaseErrorSubscription = null;

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

export default function Buy() {
  // const [products, setProducts] = useState(fakeProducts);
  // const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  const initialIAP = useCallback(async () => {
    try {
      setIsLoading(true);
      await RNIap.initConnection();
      await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      purchaseUpdateSubscription = purchaseUpdatedListener(purchase => {
        const receipt = purchase.purchaseToken;
        if (receipt) {
          finishTransaction(purchase, true)
            .then(() => {
              handleCompletePurchase(purchase.productId);
            })
            .catch(() => {
              Alert.alert('purchase is failed', 'the purchase is failed');
            });
        }
      });

      const res = await RNIap.getProducts(items.map(item => item.sku));

      setProducts(res);
    } catch (err) {
      Alert.alert(err.message);
      // console.warn(err.code, err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initialIAP();
    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
    };
  }, []);

  const handleCompletePurchase = productId => {
    switch (productId) {
      case items[0].sku:
        dispatch(increamentByAmount(items[0].value));
        break;
      case items[1].sku:
        dispatch(increamentByAmount(items[1].value));
        break;
      case items[2].sku:
        dispatch(increamentByAmount(items[2].value));
        break;
      case items[3].sku:
        dispatch(increamentByAmount(items[3].value));
        break;
      default:
        break;
    }
  };

  const handleRequestBuy = productId => {
    RNIap.requestPurchase(productId);
  };

  return (
      <ScrollView
        style={styles.bg}
        contentContainerStyle={{ paddingTop: 10}}>
        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <>
            <View style={styles.itemList3}>
              {products.map((product, index) => (
                <View style={styles.item3} key={product.productId}>
                  <TouchableOpacity
                    onPress={() => handleRequestBuy(product.productId)}
                    style={styles.item3Content}>
                    <Text style={styles.price}>{product.localizedPrice}</Text>
                    <Text style={styles.descr}>{product.description}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  homeView: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'cover',
  },
  items: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  bg: {
    backgroundColor: '#223321',
    width: '100%',
    height: '100%',
  },
  itemsSubs: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  item: {
    margin: 5,
    width: 150,
    height: 150,
    backgroundColor: '#fff',
    elevation: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemSub: {
    margin: 5,
    width: 150,
    paddingVertical: 10,
    backgroundColor: '#fff',
    elevation: 1,
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  d: {
    width: 30,
    height: 20,
    marginRight: 5,
  },
  price: {
    fontFamily: 'AllerDisplay',
    fontSize: windowWidth > 640 ? 30 : 20,
    color: 'blue',
  },
  descr: {
    fontSize: windowWidth > 640 ? 20 : 18,
    color: 'blue',
    fontFamily: 'AllerDisplay',
  },
  itemList: {},
  item2: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 3,
    elevation: 2,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item2Body: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemList3: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item3: {
    width: '50%',
    padding: 5,
  },
  item3Content: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 3,
    elevation: 2,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});