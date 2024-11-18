import React from 'react';
import './Home.css'; // Ensure the CSS for the popup is included here
import axios from 'axios';
import Kalkulator from './Kalkulator'; // Import Kalkulator component

const Home = () => {
  const [artikel, setArtikel] = React.useState([]);
  const [popupData, setPopupData] = React.useState(null); // State for popup data
  const [popupVisible, setPopupVisible] = React.useState(false); // State to control popup visibility
  const [currentSlide, setCurrentSlide] = React.useState(0); // State for current slide index

  // State for changing the title
  const [currentTitleIndex, setCurrentTitleIndex] = React.useState(0);
  const [fadeOut, setFadeOut] = React.useState(false); // State for fade-out effect
  const titles = [
    'Lengkapi Nutrisimu',
    'Penuhi Kebutuhan Harianmu',
    'Jaga Pola Makan dan Kesehatan'
  ];

  React.useEffect(() => {
    const fetchArtikel = async () => {
      try {
        const response = await axios.get('http://localhost:8080/berita'); // Update with your endpoint
        setArtikel(response.data);
      } catch (error) {
        console.error('Error fetching article data:', error);
      }
    };

    fetchArtikel();

    // Set interval for auto sliding
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 3); // Assuming you have 3 slides
    }, 3000); // Change slide every 3 seconds

    // Set interval for changing titles
    const titleInterval = setInterval(() => {
      setFadeOut(true); // Start fade out
      setTimeout(() => {
        setCurrentTitleIndex((prevIndex) => (prevIndex + 1) % titles.length);
        setFadeOut(false); // Finish fade out
      }, 500); // Adjust with CSS transition duration
    }, 3000); // Change title every 3 seconds

    return () => {
      clearInterval(slideInterval); // Clear interval when component unmounts
      clearInterval(titleInterval); // Clear title interval
    };
  }, []);

  const openPopup = (article) => {
    setPopupData(article);
    setPopupVisible(true); // Show popup
  };

  const closePopup = () => {
    setPopupVisible(false); // Hide popup
    setTimeout(() => setPopupData(null), 300); // Clear data after animation
  };

  // Animation effect
  const [isVisible, setIsVisible] = React.useState(Array(artikel.length).fill(false));

  const observer = React.useRef(
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = entry.target.dataset.index;
          setIsVisible((prev) => {
            const newVisibility = [...prev];
            newVisibility[index] = true; // Set this article as visible
            return newVisibility;
          });
          observer.current.unobserve(entry.target); // Stop observing this article
        }
      });
    })
  );

  React.useEffect(() => {
    const elements = document.querySelectorAll('.article-container');
    elements.forEach((element, index) => {
      element.dataset.index = index; // Store index
      observer.current.observe(element); // Observe each article
    });

    return () => {
      elements.forEach((element) => {
        observer.current.unobserve(element);
      });
    };
  }, [artikel]);

  return (
    <div>
      <div className="slider-container">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }} // Use slide index to move slide
        >
          <div className="slide">
            <div className="image-container">
              <img src="assets/image/1.png" alt="Deskripsi gambar 1" />
            </div>
          </div>
          <div className="slide">
            <div className="image-container">
              <img src="assets/image/2.png" alt="Deskripsi gambar 2" />
            </div>
          </div>
          <div className="slide">
            <div className="image-container">
              <img src="assets/image/3.png" alt="Deskripsi gambar 3" />
            </div>
          </div>
        </div>
      </div>

      {/* Title container with background */}
      <div className="title-container">
        {/* Title that changes every 3 seconds */}
        <h2 className={`nutrition-title ${fadeOut ? 'fade-out' : ''}`}>
          {titles[currentTitleIndex]}
        </h2>
      </div>

      <div className="menu-container">
        <div className="menu-item" onClick={() => (window.location.href = '/remaja')}>
          <img src="assets/image/teenagers.jpg" alt="Nutrisi Remaja" />
          <h3>Nutrisi Remaja</h3>
          <p>Informasi tentang nutrisi penting untuk remaja.</p>
        </div>
        <div className="menu-item" onClick={() => (window.location.href = '/lansia')}>
          <img src="assets/image/oldman.jpg" alt="Nutrisi Lansia" />
          <h3>Nutrisi Lansia</h3>
          <p>Panduan nutrisi untuk lansia agar tetap sehat.</p>
        </div>
        <div className="menu-item" onClick={() => (window.location.href = '/ibu_hamil')}>
          <img src="assets/image/pregnant.jpg" alt="Nutrisi Ibu Hamil" />
          <h3>Nutrisi Ibu Hamil</h3>
          <p>Kebutuhan nutrisi untuk ibu hamil dan menyusui.</p>
        </div>
        <div className="menu-item" onClick={() => (window.location.href = '/ibu_menyusui')}>
          <img src="assets/image/mom.jpg" alt="Nutrisi Keluarga" />
          <h3>Nutrisi Ibu Menyusui</h3>
          <p>Tips dan panduan nutrisi untuk ibu menyusui.</p>
        </div>
      </div>

      <div className="articles-container">
        <h2 className="articles-title">Artikel Remaja</h2>
        <div className="article-section">
          {artikel
            .filter((article) => article.kategori === 'remaja')
            .map((article, index) => (
              <div
                className={`article-container ${isVisible[index] ? 'animate' : ''}`}
                key={index}
                onClick={() => openPopup(article)}
              >
                <img
                  // src={`http://localhost:8080/uploads/${article.image}`}
                  // alt={article.judul}
                  // className="article-image"
                />
                <h3 className="article-title">{article.judul}</h3>
                <p>{article.deskripsi}</p>
              </div>
            ))}
        </div>

        <h2 className="articles-title">Artikel Lansia</h2>
        <div className="article-section">
          {artikel
            .filter((article) => article.kategori === 'lansia')
            .map((article, index) => (
              <div
                className={`article-container ${
                  isVisible[index + artikel.filter((a) => a.kategori === 'remaja').length]
                    ? 'animate'
                    : ''
                }`}
                key={index}
                onClick={() => openPopup(article)}
              >
                <h3 className="article-title">{article.judul}</h3>
                <p>{article.deskripsi}</p>
              </div>
            ))}
        </div>

        <h2 className="articles-title">Artikel Ibu Hamil</h2>
        <div className="article-section">
          {artikel
            .filter((article) => article.kategori === 'ibu hamil')
            .map((article, index) => (
              <div
                className={`article-container ${
                  isVisible[
                    index +
                      artikel.filter((a) => a.kategori === 'remaja').length +
                      artikel.filter((a) => a.kategori === 'lansia').length
                  ]
                    ? 'animate'
                    : ''
                }`}
                key={index}
                onClick={() => openPopup(article)}
              >
                <h3 className="article-title">{article.judul}</h3>
                <p>{article.deskripsi}</p>
              </div>
            ))}
        </div>

        <h2 className="articles-title">Artikel Ibu Menyusui</h2>
        <div className="article-section">
          {artikel
            .filter((article) => article.kategori === 'ibu menyusui')
            .map((article, index) => (
              <div
                className={`article-container ${
                  isVisible[
                    index +
                      artikel.filter((a) => a.kategori === 'remaja').length +
                      artikel.filter((a) => a.kategori === 'lansia').length +
                      artikel.filter((a) => a.kategori === 'ibu hamil').length
                  ]
                    ? 'animate'
                    : ''
                }`}
                key={index}
                onClick={() => openPopup(article)}
              >
                <h3 className="article-title">{article.judul}</h3>
                <p>{article.deskripsi}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Kalkulator Section */}
      <Kalkulator />

      {/* Popup for article details */}
      {popupVisible && (
  <div className={`popup ${popupVisible ? 'visible' : ''}`}>
    <div className="popup-content">
      {popupData && (
        <>
          <h3>{popupData.judul}</h3>
          <p>{popupData.isi}</p>
        </>
      )}
      <button className="close-popup" onClick={closePopup}>Tutup</button>
    </div>
  </div>
)}

      </div>
      );
    };

export default Home;
