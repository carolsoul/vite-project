import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Home.module.css';

function Home() {
    const navigate = useNavigate(); // hook para navegação
  
    const irParaFaceId = () => {
      navigate('/reconhecimento-facial'); // muda de página
    };

  return (
    <div className={styles.homeContainer}>
        <p>Quero testar o reconhecimento facial.</p>
        <small>Não vou roubar seus dados.</small>

      <button className={styles.button} onClick={irParaFaceId}>
        Começar reconhecimento facial
      </button>
    </div>
  );
}

export default Home;
