import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Lansia.css';

const Lansia = () => {
  const [nutrisi, setNutrisi] = useState([]);
  const [articles, setArticles] = useState([]);
  const [activeArticle, setActiveArticle] = useState(null); // State for active popup article

  useEffect(() => {
    const fetchNutrisi = async () => {
      try {
        const response = await axios.get('http://localhost:8080/lansia');
        setNutrisi(response.data);
      } catch (error) {
        console.error('Error fetching nutrition data:', error);
      }
    };

    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/berita');
        const filteredArticles = response.data.filter(article => article.kategori === 'lansia');
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
    const arrow = element.previousElementSibling.querySelector('.arrow-lansia');
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
    <div className="container-lansia">
      <h1>Informasi Nutrisi untuk Lansia</h1>
      {nutrisi.length > 0 ? (
        <div className="nutrisi-list-lansia">
          {nutrisi.map((item, index) => (
            <div className="nutrisi-item-lansia" key={index}>
              <strong>{item.nutrisi} ({item.jumlah})</strong>
              <ul>
                {item.sumber.split(',').map((source, i) => (
                  <li key={i}>{source.trim()}</li>
                ))}
              </ul>
              <div className="description-dropdown-lansia">
                <h2 tabIndex="0" onClick={() => toggleDescription(index)}>
                  Deskripsi {item.nutrisi} <span className="arrow-lansia">&#9662;</span>
                </h2>
                <div id={`description${index}`} className="collapse-lansia">
                  <p>{item.deskripsi}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data-lansia">Tidak ada data nutrisi untuk lansia.</p>
      )}

      <p className="disclaimer-lansia">Sesuaikan kebutuhan nutrisi Anda dengan kondisi tubuh Anda.
        Setiap orang memiliki kebutuhan nutrisi yang berbeda 
        sesuai dengan keadaan fisiknya masing-masing.
      </p>

      <h1 className="article-heading-lansia">Artikel untuk Lansia</h1>      
        {articles.length > 0 ? (
        <div className="articles-list-lansia">
          {articles.map((article, index) => (
            <div className="article-container-lansia" key={index}>
              <h2 onClick={() => togglePopup(article)} className="article-title-lansia">
                {article.judul}
              </h2>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data-lansia">Tidak ada artikel untuk lansia.</p>
      )}

      {activeArticle && (
        <div className="popup-lansia">
          <div className="popup-content-lansia">
            <h2>{activeArticle.judul}</h2>
            <div>{formatArticleContent(activeArticle.isi)}</div>
            <button onClick={closePopup} className="close-popup-lansia">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lansia;
