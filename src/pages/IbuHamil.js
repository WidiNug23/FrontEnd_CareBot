import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './IbuHamil.css';

const IbuHamil = () => {
  const [nutrisi, setNutrisi] = useState([]);
  const [articles, setArticles] = useState([]);
  const [activeArticle, setActiveArticle] = useState(null); // State for active popup article

  useEffect(() => {
    const fetchNutrisi = async () => {
      try {
        const response = await axios.get('http://localhost:8080/ibu_hamil');
        setNutrisi(response.data);
      } catch (error) {
        console.error('Error fetching nutrition data:', error);
      }
    };

    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/berita');
        const filteredArticles = response.data.filter(article => article.kategori === 'ibu hamil');
        setArticles(filteredArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchNutrisi();
    fetchArticles();
  }, []);

  const toggleDescription = (index) => {
    const element = document.getElementById(`description${index}`);
    const arrow = element.previousElementSibling.querySelector('.arrow-ibu-hamil');
    const header = element.previousElementSibling;

    if (element.classList.contains('show')) {
      element.classList.remove('show');
      header.classList.remove('active'); // Remove active class
      arrow.innerHTML = '&#9662;'; // Down arrow
    } else {
      element.classList.add('show');
      header.classList.add('active'); // Add active class
      arrow.innerHTML = '&#9652;'; // Up arrow
    }
  };

  const togglePopup = (article) => {
    setActiveArticle(article); // Set selected article for popup
  };

  const closePopup = () => {
    setActiveArticle(null); // Close popup
  };

  const formatArticleContent = (content) => {
    // Pisahkan berdasarkan dua newline untuk membuat paragraf
    const paragraphs = content.split(/\n\n/);
    
    return paragraphs.map((paragraph, index) => {
      // Deteksi poin menggunakan tanda "-" dan nomor dengan "1.", "2.", dll.
      if (paragraph.startsWith("1.")) {
        const numberedPoints = paragraph.split("\n");
        return (
          <ol key={index}>
            {numberedPoints.map((point, idx) => (
              <li key={idx}>{point.replace(/^\d+\.\s*/, '')}</li>
            ))}
          </ol>
        );
      } else if (paragraph.startsWith("-")) {
        const bulletPoints = paragraph.split("\n");
        return (
          <ul key={index}>
            {bulletPoints.map((point, idx) => (
              <li key={idx}>{point.replace(/^\-\s*/, '')}</li>
            ))}
          </ul>
        );
      } else {
        // Jika bukan poin atau nomor, render sebagai paragraf biasa
        return <p key={index}>{paragraph}</p>;
      }
    });
  };

  return (
    <div className="container-ibu-hamil">
      <h1>Informasi Nutrisi untuk Ibu Hamil</h1>
      {nutrisi.length > 0 ? (
        <div className="nutrisi-list-ibu-hamil">
          {nutrisi.map((item, index) => (
            <div className="nutrisi-item-ibu-hamil" key={index}>
              <strong>{item.nutrisi} ({item.jumlah})</strong>
              <ul>
                {item.sumber.split(',').map((source, i) => (
                  <li key={i}>{source.trim()}</li>
                ))}
              </ul>
              <div className="description-dropdown-ibu-hamil">
                <h2 tabIndex="0" onClick={() => toggleDescription(index)}>
                  Deskripsi {item.nutrisi} <span className="arrow-ibu-hamil">&#9662;</span>
                </h2>
                <div id={`description${index}`} className="collapse-ibu-hamil">
                  <p>{item.deskripsi}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data-ibu-hamil">Tidak ada data nutrisi untuk Ibu Hamil.</p>
      )}

      <p className="disclaimer-ibu-hamil">Sesuaikan kebutuhan nutrisi Anda dengan kondisi tubuh Anda.
        Setiap orang memiliki kebutuhan nutrisi yang berbeda 
        sesuai dengan keadaan fisiknya masing-masing.
      </p>

    <h1 className="article-heading-ibu-hamil">Artikel untuk Ibu Hamil</h1>
      {articles.length > 0 ? (
        <div className="articles-list-ibu-hamil">
          {articles.map((article, index) => (
            <div className="article-container-ibu-hamil" key={index}>
              <h2 onClick={() => togglePopup(article)} className="article-title-ibu-hamil">
                {article.judul}
              </h2>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data-ibu-hamil">Tidak ada artikel untuk Ibu Hamil.</p>
      )}

      {activeArticle && (
        <div className="popup-ibu-hamil">
          <div className="popup-content-ibu-hamil">
            <h2>{activeArticle.judul}</h2>
            <div>{formatArticleContent(activeArticle.isi)}</div>
            <button onClick={closePopup} className="close-popup-ibu-hamil">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IbuHamil;
