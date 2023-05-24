import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonList, IonModal, IonButtons, IonButton, IonThumbnail, useIonAlert, ion } from '@ionic/react';
import './Home.css';
import axios from 'axios';
import React, { useState, useEffect, useRef } from "react";
import { Preferences } from '@capacitor/preferences';
import { Toast } from '@capacitor/toast';


const Home: React.FC = () => {
  
  const [list, setList] = useState([])
  const [isOpen, setIsOpen] = useState(false);
  const [presentAlert] = useIonAlert();
  const[model, setModel] = useState([])

  let listP: null = null


  const URI = 'https://rickandmortyapi.com/api/character/1,2,3,4,5'

  function prueba(personaje: React.SetStateAction<never[]>) {
    setModel(personaje)
    setIsOpen(true)
  }

  const DeleteItems = (indexItem: number) => {
    showHelloToast();
    presentAlert({
      header: 'Importante',
      message: 'Se borro el elemento',
      buttons: ['OK'],
    })
    setList((prevState) =>
      prevState.filter((todo, index) => index !== indexItem)
    );
  };

  const setName = async (lista: any) => {
    await Preferences.set({
      key: 'listC',
      value: JSON.stringify(lista),
    });
  };

  const checkName = async () => {
    const { value } = await Preferences.get({ key: 'listC' });
    listP = await JSON.parse(value)
  };


  const existsName = async () => {
    const { value } = await Preferences.get({ key: 'listC' });
    if(value == undefined){
      return false;
    }
    return true;
  };
  
  
  const getList =async () => {
    const res = await axios.get(URI)
    await setList(res.data)
    await setName(res.data)
  }

  const showHelloToast = async () => {
    await Toast.show({
      text: 'Se borro el elemento',
    });
  }; 
  
  useEffect(() => {
    existsName().then(resultado => {
      if(resultado == false){
        getList()
      }
      else{
        checkName()
        setList(listP)
      }
      
    }).catch(error => {
      console.error(error);
    });
    
    
  }, []); 

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Rick and Morty</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Rick and Morty</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* <ExploreContainer /> */}
        <IonList>
          {list.map((item, index) => (
          <IonItem key={index}>
            <IonLabel onClick={() => prueba(item)}>
             {item.name}
            </IonLabel>
            <IonLabel> 
             <IonButtons slot="end" id="present-alert">
                <IonButton onClick={() => DeleteItems(index)}>Borrar</IonButton>
              </IonButtons>
            </IonLabel>
          </IonItem>
        ))}
        </IonList>
        <IonModal isOpen={isOpen}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Modal</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <p>
             <IonThumbnail slot="start">
                <img src={model.image} /> 
              </IonThumbnail>
            </p>
            <div>
              Name: {model.name}
            </div>
            <div>
              Status: {model.status}
            </div>
            <div>
              Species: {model.species}
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;
