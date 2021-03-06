import React,{useState,useEffect}from 'react';
import { StyleSheet, Text, View,NativeModules,Image,Linking} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {FontAwesome5} from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'; 
import { Card, Title } from 'react-native-paper';
import firebase from '../Database/firebase';
import RejectRequestModal from '../components/RejectModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AssignModal from './AssignModal';
import AlertView from "../components/AlertView";

const RequestDetails = ({navigation,route})=>{
    var  RequestId = route.params.ID;
    var DATE=route.params.DATE
    var UserId=route.params.UserId
    var STATUS=route.params.STATUS
    const [DriverList,setDriverList] = useState([])
    const[Materials,setMaterials]= useState([]);
    const[RejectModal,setRejectModal]= useState(false);
    const [UserName,setUserName]=useState("");
    const [Name,setName]=useState("");
    const [Location,setLocation] = useState({
      address:"",
      latitude:0,
      longitude:0
    });
    const [Picture,setPicture] = useState("")
    const [VisibleAssignModal,setVisibleAssignModal] = useState(false)
    const [alert,setAlert]=React.useState({
      alertVisible:false,
      Title:'',
      Message:'',
      jsonPath:'',   
    })

    const [Token,setToken]=useState("")

    const fetchMaterials=(ID)=>{
      firebase.database().ref("Material/"+ID).on('value',snapshot=>{
          const Data = snapshot.val();
          if(Data){
            var li = []
            snapshot.forEach(function(snapshot){
            var temp={MaterialType:snapshot.val().MaterialType, Id:snapshot.key, Quantity:snapshot.val().Quantity,Type:snapshot.val().Type}
            li.push(temp)
            })
            setMaterials(li)
            console.log(Materials);
            console.log(li) 
          }
        })
  }

  const fetchUserInfo=(UserId)=>{
    firebase.database().ref('User/' + UserId).on('value',snapshot=>{
      const userData = snapshot.val();
      setName(userData.Name);
      setUserName(userData.UserName);
      setLocation({
        ...Location,
        address:userData.Location.address,
        latitude:userData.Location.latitude,
        longitude:userData.Location.longitude           
      })
      if(userData.expoToken){
        setToken(userData.expoToken)
      }
    })
  }

  const retriveImage= async (UserId)=>{
    var imageRef = firebase.storage().ref('images/' + UserId);
    imageRef
      .getDownloadURL()
      .then((url) => {
        //from url you can fetched the uploaded image easily
        setPicture(url);
      })
      .catch((e) => console.log('getting downloadURL of image error => ', e));
  }

  const openMaps = (latitude, longitude) => {
    const daddr = `${latitude},${longitude}`;
    // const company = Platform.OS === "ios" ? "apple" : "google";
    const company = "google";
    Linking.openURL(`http://maps.${company}.com/maps?daddr=${daddr}`);
  }

  const fetchDrivers=async()=>{
    await firebase.database().ref('/DeliveryDriver/').on('value',snapshot=>{
       const Data = snapshot.val();
       if(Data){
           var li = []
             snapshot.forEach(function(snapshot){
             var DriverId=snapshot.key
             if(snapshot.val().Status=="Accepted"){
              var temp={DriverId:DriverId,DriverName:snapshot.val().Name,DriverUserName:snapshot.val().UserName,DeliveryArea:snapshot.val().DeliveryArea,Token:snapshot.val().expoToken}
              li.push(temp)
             }
           })
           setDriverList(li);
         }
   }) 
 }

    const ShowModal=()=>{
      setVisibleAssignModal(false)
      setAlert({
        ...alert,
        Title:'?????????? ??????????',
        Message:'???? ?????????? ?????????? ??????????',
        jsonPath:"success",
        alertVisible:true,
    });
    setTimeout(() => {
        setAlert({
            ...alert,
            alertVisible:false,
        });
        navigation.navigate("RequestHome");
    }, 4000)
    }

  useEffect(()=>{
    fetchMaterials(RequestId)
    fetchUserInfo(UserId)
    retriveImage(UserId)
    fetchDrivers();

  },[])

    return (
     
        <View style={styles.container}>
          <View style={styles.fixedHeader}>
              <LinearGradient
                  colors={["#809d65","#9cac74"]}
                  style={{height:"100%" ,width:"100%"}}>
                <SafeAreaView style={{flexDirection:'row-reverse'}}>
                    <View style={[styles.header,styles.flexDirectionStyle]}>
                        <FontAwesome5 name="chevron-right" size={24} color="#ffff" style={styles.icon}
                            onPress={()=>navigation.navigate("RequestHome")}
                          />
                        <View>
                            <Text style={styles.headerText}> ???????????? ??????????</Text>
                        </View>
                    </View>
                </SafeAreaView>
              </LinearGradient> 
          </View>

          <View style={{flex:8}}>
            <KeyboardAwareScrollView >
            <Card style={styles.item}>
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
                    <View style={{flexDirection:'row-reverse'}}>
                      <Title style={[styles.text,{fontSize: 15}]}>:???????? ??????????</Title>
                      <Text style={{textAlign:"right",fontSize: 15,marginTop:7}}>{Name}</Text>
                    </View>
                    <Text style={styles.user}>@{UserName}</Text>
                    <Image
                            style={{width:'80%',marginTop:10}}
                            source={require('../assets/line.png')}
                            />
              </View>
              <Title style={styles.text}> :?????? ???????????? ????????????????</Title>
              <Text style={{textAlign:"right",fontSize: 18,marginTop:5,marginRight:10}}>{DATE}</Text>
              <Title style={styles.text}> :????????????</Title>
              {
                Materials.map((item)=>
                <View>
                  <View style={{flexDirection:"row-reverse",marginRight:8}}>
                    <Text style={styles.textStyle}>?????? ????????????:</Text>
                    <Text style={{textAlign:"right",fontSize: 18,marginRight:5}}>{item.MaterialType}</Text>
                  </View>

                  <View style={{flexDirection:"row-reverse",marginRight:8}}>
                    <Text style={styles.textStyle}>????????????:</Text>
                    <Text style={{textAlign:"right",fontSize: 18,marginRight:5,marginTop:4}}>{item.Quantity}</Text>
                    <Text style={{textAlign:"right",fontSize: 18,marginRight:5,marginTop:4}}>{item.Type}</Text>
                  </View>
              </View>
              )
              }
              <Title style={styles.text}> : ???????? ????????????????</Title>
              <TouchableOpacity onPress={()=>{openMaps(Location.latitude,Location.longitude)}}>
              <Text style={{textAlign:"right",fontSize: 18,marginTop:5,marginRight:10}}>{Location.address}</Text>
              </TouchableOpacity>
            </Card> 
            </KeyboardAwareScrollView>
            <View style={[styles.flexDirectionStyle,styles.button,{marginTop:5}]}>
              <TouchableOpacity style={[styles.button,]}
                onPress={()=>setVisibleAssignModal(true)}>
                <LinearGradient
                    colors={["#809d65","#9cac74"]}
                    style={styles.signIn}>   
                  <Text style={[styles.textSign,{color:'#fff'}]}>????????</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button]}
                    onPress={()=>setRejectModal(true)}>
                <LinearGradient
                  colors={["#B71C1C","#D32F2F"]}
                  style={styles.signIn}>   
                  <Text style={[styles.textSign,{color:'#fff'}]}>??????</Text>
                </LinearGradient>  
                </TouchableOpacity> 
            </View>
             
          </View>

          {RejectModal?
                <RejectRequestModal UserId={UserId} RequestId={RequestId} setRejectModal={setRejectModal} navigation={navigation} title="?????? ??????????" message="???? ?????? ?????????? ???? ?????? ??????????" type="reject Request" Token={Token}></RejectRequestModal>
              :
                null
          }

          {VisibleAssignModal?
                <AssignModal ID={RequestId} DATE={DATE} AssignList={DriverList} setVisibleAssignModal={setVisibleAssignModal} UserId={UserId} navigation={navigation} ShowModal={ShowModal} Token={Token} Status={STATUS}></AssignModal>
              :
                null
          }
          {
              alert.alertVisible?
                  <AlertView title={alert.Title} message={alert.Message} jsonPath={alert.jsonPath}></AlertView>
              :
                  null
          }
        </View>  


      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header:{
      width: '100%',
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:15
   },
    headerText:{
      fontWeight:'bold',
      fontSize: 20,      
      letterSpacing: 1, 
      textAlign:'center',
      color: '#ffff'
    },
    flexDirectionStyle:{
      flexDirection: Platform.OS === 'android' && 
      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'row' : 'row-reverse',  
    },
    icon:{
      position: 'absolute',
      left: 16
    },
    text: {
      color: '#b2860e',
      fontSize: 18,
      textAlign: Platform.OS === 'android' && 
      NativeModules.I18nManager.localeIdentifier === 'ar_EG' || 
      NativeModules.I18nManager.localeIdentifier === 'ar_AE' ||
      NativeModules.I18nManager.localeIdentifier === 'ar_SA'? 'left' : 'right',
      marginRight:5,
      marginLeft:5,
    },
    textStyle:{
      color: '#9E9E9E',
      fontSize: 17,
      marginTop:3,
      marginRight:10
    },
    item: {
      flexDirection:"column",
      backgroundColor: '#F3F3F3',
      padding: 20,
      marginVertical: 20,
      marginHorizontal: 16,
      borderRadius :10,
      shadowColor :'#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 5,
      padding :15,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft:15,
      paddingRight:15,
      paddingBottom:10,
    },
    signIn: {
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginLeft:50,
      marginRight:50
    },
    textSign: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    fixedHeader :{
      flex:1,
      backgroundColor :'#9E9D24',
      overflow: 'hidden',
    },
    profile_image:{
      width:100,
      height:100,
      borderRadius:150/2,
      borderColor:'#f2f2f2',
      borderWidth:1
    },
    user: {
      fontSize: 15,
      textAlign :'right',
      color :'#ADADAD',
    }
  });
export default RequestDetails;