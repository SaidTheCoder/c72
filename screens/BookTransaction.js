import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity,TextInput,Image,KeyboardAvoidingView, Alert } from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner'
import * as Permissions from 'expo-permissions'
import * as firebase from 'firebase'
import db from '../Config'

export default class BookTransaction extends React.Component{
    constructor(){
        super()
        this.state ={
            hasCameraPermission:null,
            scanned:false,
            scannedData:'',
            buttonState:"normal",
            scannedBookId:'',
            scannedStudentId:''
        }
    }

    getCameraPermissions= async(id)=>{
        const {status}=await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission:status==="granted",
            buttonState:id,
        })
    }

    handleBarCodeScanned= async({type,data})=>{
        this.setState({
            scanned:true,
            scannedData:data,
            buttonState:"normal"
        })
    }

    handleTransaction=async()=>{
var transactionMessage
db.collection("books").doc(this.state.scannedBookId).get().then((doc)=>{
    var book = doc.data()
    if(book.bookAvailability){
        this.initiateBookIssue()
        transactionMessage="bookIssued"
        Alert.alert(transactionMessage)
    }
    else{
        this.initiateBookReturn()
        transactionMessage="bookReturn"
        Alert.alert(transactionMessage)
    }
})
    }

initiateBookIssue=async()=>{
    db.collection("transactions").add({
        'studentID':this.state.scannedStudentId,
        'bookID':this.state.scannedBookId,
        'date':firebase.firestore.Timestamp.now().toDate(),
        'transactionType':"issue"
    })

    db.collection("books").doc(this.state.scannedBookId).update({
        'bookAvailability':false
    })
    
    db.collection("students").doc(this.state.scannedStudentId).update({
        'numberOfBooksIssued':firebase.firestore.FieldValue.increment(1)
    })
    Alert.alert("Book Issued")
    this.setState({
        scannedBookId:'',
        scannedStudentId:''
    })
}

initiateBookReturn=async()=>{
    db.collection("transactions").add({
        'studentID':this.state.scannedStudentId,
        'bookID':this.state.scannedBookId,
        'date':firebase.firestore.Timestamp.now().toDate(),
        'transactionType':"return"
    })

    db.collection("books").doc(this.state.scannedBookId).update({
        'bookAvailability':false
    })
    
    db.collection("students").doc(this.state.scannedStudentId).update({
        'numberOfBooksReturned':firebase.firestore.FieldValue.increment(1)
    })
    Alert.alert("Book Returned")
    this.setState({
        scannedBookId:'',
        scannedStudentId:''
    })
}
    render(){
        const hasCameraPermission= this.state.hasCameraPermission
        const scanned = this.state.scanned
        const buttonState=this.state.buttonState
        if(buttonState!=="normal"&& hasCameraPermission){
            return(
                <BarCodeScanner
                onBarCodeScanned={scanned?undefined:this.handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}/>
            )
        }
        else if(buttonState=== "normal"){
        return(
            <KeyboardAvoidingView style={styles.container} behavior="padding"enabled>
            <View style = {styles.container}>
                <View>
                <Image source ={require("../assets/booklogo.jpg")} style={{width:200,height:200}}/>
    <Text style={{textAlign:"center",fontSize:30}}>WILY</Text>
                </View>

                <View style = {styles.inputView}>
                    <TextInput style={styles.inputBox}
                    placeholder = "Book Id"
                    onChangeText={text=>this.setState({scannedBookId:text})}
                    value={this.state.scannedBookId}></TextInput>

                    <TouchableOpacity style ={styles.scanButton}
                    onPress={()=>{
                        this.getCameraPermissions("bookId")
                    }}>
                        <Text style = {styles.buttonText}>Scan</Text>
                    </TouchableOpacity>

                </View>
                

                <View style = {styles.inputView}>

                    <TextInput style={styles.inputBox}
                    placeholder = "Student Id"
                    onChangeText={text=>this.setState({scannedStudentId:text})}
                    value={this.state.scannedStudentId}></TextInput>

                    <TouchableOpacity style ={styles.scanButton}
                    onPress={()=>{
                        this.getCameraPermissions("studentId")
                    }}>
                    
                        <Text style = {styles.buttonText}>Scan</Text>
                    </TouchableOpacity>

                </View>

                {/* <Text style ={styles.displayText}>
                    {
                        hasCameraPermission===true?this.state.scannedData:"Please request camera permissions"
                    }
                </Text>
                <TouchableOpacity style={styles.scanButton}
                onPress={this.getCameraPermissions}
                >
            <Text style={styles.buttonText}>Scan QR Code</Text>
            </TouchableOpacity> */}
             <TouchableOpacity style={styles.submitButton}
             onPress={async()=>{
                 this.handleTransaction()
             }}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>    
            </View>
            </KeyboardAvoidingView>
            
        )
    }
}
}
const styles = StyleSheet.create({
container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
},
displayText:{
    fontSize:15,
    textDecorationLine:"underline"
},
scanButton:{
    backgroundColor:"green",
    padding:10,
    margin:10
},
buttonText:{
    fontSize:15,
    textAlign:"center",
    marginTop:10
},
inputView:{
    flexDirection:"row",
    margin:20
},
inputBox:{
    width:200,
    height:40,
    borderWidth:1.5,
    borderRightWidth:0,
    fontSize:20
},
scanButton:{
    backgroundColor:"yellow",
    width:50,
    borderWidth:2,
},
submitButton:{
    backgroundColor:"red",
    width:100,
    height:50
},
submitButtonText:{
    padding:10,
    textAlign:"center",
    fontSize:20,
    color:"black",
    fontWeight:"bold"
}
})