import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import styles from '../styles/FaceId.module.css';

function FaceId() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [reconhecido, setReconhecido] = useState(false);
  const [status, setStatus] = useState('Iniciando câmera...')

  useEffect(() => {
  const iniciar = async () => {
    await startVideo();               // aguarda câmera iniciar
    await loadModels();               // aguarda modelos
    detectar();                       // só chama depois de tudo pronto
  };

  iniciar();

  return () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };
}, []);

const startVideo = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      setStatus('Reconhecendo você...');
    }
  } catch (err) {
    console.error('Erro ao acessar a câmera:', err);
    setStatus('Erro ao acessar a câmera! :(');
  }
};

const loadModels = async () => {
  try {
    await Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector_model'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68_model'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models/face_recognition_model'),
]);
console.log('Modelos carregados com sucesso!');
  } catch (err) {
    console.error('Erro ao carregar modelos:', err);
  }
};

    const detectar = async () => {
      const imagemReferencia = await faceapi.fetchImage('/referencia.jpg');
      const resultadoReferencia = await faceapi
        .detectSingleFace(imagemReferencia, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();


      if (!resultadoReferencia) {
        alert('Não foi possível detectar um rosto na imagem de referência.');
        return;
      }

      const faceMatcher = new faceapi.FaceMatcher(
        new faceapi.LabeledFaceDescriptors('referencia', [resultadoReferencia.descriptor]),
        0.6
      );

      const intervalo = setInterval(async () => {
        if (!videoRef.current) return;

        const detections = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detections) {
          const resultado = faceMatcher.findBestMatch(detections.descriptor);
          console.log('Resultado:', resultado); // para debug
          if (resultado.label === 'referencia') {
            setReconhecido(true);
            setStatus('É você mesmo! :D')
            clearInterval(intervalo);
          }
        }
      }, 1000);
    };

  {/*const irParaEscolhaNome = () => {
    if (reconhecido) navigate('/escolha-de-nome');
  };*/}

  return (
    <div className={styles.FaceIdContainer}>
      <h1 className={styles.faceTitle}>Encaixe o rosto no círculo</h1>

      <div className={styles.camera}>
        <video ref={videoRef} autoPlay muted/>
      </div>

      <p className={styles.statusMessage}>{status}</p>
      
    </div>
  );
}

export default FaceId;
