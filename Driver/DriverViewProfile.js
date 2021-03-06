import React, {useEffect,useState}from 'react';
import { StyleSheet, Text, View,Image,Platform}from 'react-native';
import {Title,Card,Button}from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import { NativeModules } from 'react-native';
import firebase from '../Database/firebase';
import {FontAwesome5} from '@expo/vector-icons';
import { YellowBox } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
YellowBox.ignoreWarnings(['Setting a timer']);

const DriverViewProfile = ({navigation})=>{

    var userId = firebase.auth().currentUser.uid;
    var query = firebase.database().ref('DeliveryDriver/' + userId);
    query.once("value").then(function(result) {
      const userData = result.val();
      setName(userData.Name);
      setPhone(userData.PhoneNumber);
      setUserName(userData.UserName);
      setLocation(userData.DeliveryArea)
      setEmail(userData.Email)
      retriveImage();
 
    });

    const [Name,setName] = useState("")
    const [Phone,setPhone] = useState("")
    const [UserName,setUserName] = useState("")
    const [Location,setLocation] = useState("")
    const [Email,setEmail] = useState("")
    const [Picture,setPicture] = useState("")

    const retriveImage= async ()=>{
        var imageRef = firebase.storage().ref('images/' + userId);
        imageRef
          .getDownloadURL()
          .then((url) => {
            //from url you can fetched the uploaded image easily
            setPicture(url);
          })
          .catch((e) => console.log('getting downloadURL of image error => ', e));
      }

    useEffect(()=>{
        retriveImage()
    },[]);

    return(

        <View style={styles.root}>
            <SafeAreaView style={{flexDirection:'row-reverse'}}>
                <View style={styles.header}>
                    <FontAwesome5 name="chevron-right" size={24} color="#161924" style={styles.icon}
                        onPress={()=>{
                            navigation.navigate("DriverHomePage")
                        }}/>
                    <View>
                        <Text style={styles.headerText}>?????????? ????????????</Text>
                    </View>
                </View>
            </SafeAreaView>


            <View style={styles.footer}>
                <View style={{alignItems:"center"}}>
                    {Picture==""?
                        <Image
                            style={styles.profile_image}
                            source={require('../assets/DefaultImage.png')}
                            />
                        :
                        <Image
                            style={styles.profile_image}
                            source={{uri:Picture}}
                            />
                    }
                        <Image
                            style={{width:'70%',marginTop:15}}
                            source={require('../assets/line.png')}
                            />
                </View>

                <View style={{alignItems:"center",margin:15}}>
                    <Title>@{UserName}</Title>
                </View>

                <Card style={styles.mycard}>
                    <View style={styles.cardContent}>
                        <Feather
                            name="user"
                            color="#929000"
                            size={25} /> 
                        <Text style={styles.mytext}>{Name}</Text>
                    </View>  
                </Card>

                <Card style={styles.mycard}>
                    <View style={styles.cardContent}>
                        <Feather
                            name="phone"
                            color="#929000"
                            size={25}/> 
                        <Text style={styles.mytext}>{Phone}</Text>
                    </View>  
                </Card>
            
                <Card style={styles.mycard}>
                    <View style={styles.cardContent}>
                        <Feather
                            name="mail"
                            color="#929000"
                            size={25}/> 
                        <Text style={styles.mytext}>{Email}</Text>
                    </View>  
                </Card>  

                <Card style={styles.mycard}>
                    <View style={styles.cardContent}>
                        <Feather
                            name="map-pin"
                            color="#929000"
                            size={25}/> 
                        <Text style={styles.mytext} >{Location}</Text>
                    </View>  
                </Card> 

                <View style={styles.button}> 
                    <Button icon="account-edit" mode="contained" theme={theme }
                        onPress={() => {
                            navigation.navigate("DriverEditProfile",{UserName,Name,Phone,Location,Email,Picture})
                        }}>
                        ??????????
                    </Button>
                </View>

            </View>  

        </View>
    );
}

const theme= {
    colors:{
        primary: "#C0CA33"
    }
}

const styles=StyleSheet.create({
    root:{
        flex:1,
        backgroundColor: '#fff',    
    },
    mycard:{
        margin:3
    },
    cardContent:{
        flexDirection: Platform.OS === 'android' &&
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',
        padding:10,
    },
    mytext:{
        fontSize:18,
        marginTop:3,
        marginRight:10,
        marginLeft: 10
    },
    profile_image:{
        width:150,
        height:150,
        borderRadius:150/2,
        marginTop:-20 
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        marginTop:-20,
    },
    button:{
        flexDirection:"row",
        justifyContent:"space-around",
        paddingTop:40,
        paddingLeft:40,
        paddingRight:40,
        paddingBottom:15
    },
    header:{
        width: '100%',
        height: 80,
        flexDirection: Platform.OS === 'android' && 
        NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
        NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
        NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row':'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText:{
        fontWeight:'bold',
        fontSize: 20,      
        letterSpacing: 1, 
        textAlign:'center',
        color: '#9E9D24'
    },
    icon:{
        position: 'absolute',
        left: 16
    },
})
export default DriverViewProfile