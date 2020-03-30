import {StyleSheet} from 'react-native';

export default StyleSheet.create({

    container: {
      flex: 1,
    },
    wrapper: {      
      flexDirection: 'row',
      paddingHorizontal : 5,
      alignItems: 'flex-start',
      //backgroundColor:'#dfdfdf',
    },
    tagInputContainerScroll: {
      flex: 1,      
      minHeight: 26,
    },
    tagInputContainer: {
      flex: 1,
      flexDirection: 'row',
      //justifyContent: 'center',
      flexWrap: 'wrap',
      //backgroundColor:'orange',
    },
    textInputContainer: {
      //height: 26, for ios
      height: 40,
      // backgroundColor:'red',
      //justifyContent: 'center',
      //marginBottom: 6
      marginTop:5
    },
    textInput: {
      fontSize: 12,
      flex: .6,     
      padding: 0,            
    },
    
    tag: {
      flexDirection:'row',
      justifyContent: 'center',
      alignItems:'center',
      marginBottom: 10,
      marginRight: 10,
      // paddingLeft: 8,
      // paddingRight: 8,
      padding:5,
      //minHeight: 26,// for ios
      //minHeight: 26,      
      height: 26,      
      borderRadius: 2,
      overflow:'hidden',
      minWidth : 80,
      
    },
    tagText: {
      padding: 0,
      margin: 0,
    },
    closeOption: {
      padding:0,
      margin: 0,
      color:'white',
      //backgroundColor:'red'
    }
  });


  

