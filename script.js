document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Element Selectors ---
    const navTabs = document.querySelectorAll('.nav-tab');
    const searchBtn = document.querySelector('.search-btn');
    const cityInputs = document.querySelectorAll('.city-input');
    const swapIcon = document.querySelector('.swap-icon');
    const bookTrainBtn = document.querySelector('.book-train-btn');
    const dealsBookBtn = document.querySelector('#deals .book-button');
    const viewAllOffersLink = document.querySelector('#offer a.text-danger'); 
    const offersContainer = document.querySelector('#offerCardsContainer'); 
    
    // Deal Selectors
    const dealTimerDisplay = document.getElementById('deal-timer');
    const copyCodeBtn = document.getElementById('copy-code-btn');
    const offerCodeInput = document.getElementById('offer-code');

    // Navbar Selectors
    const languageDropdownToggle = document.querySelector('.nav-item.dropdown a.dropdown-toggle[data-bs-toggle="dropdown"]');
    const languageDropdownItems = document.querySelectorAll('.dropdown-menu a.dropdown-item');
    const heroTitle = document.querySelector('#search h2');
    const offerHeader = document.querySelector('#offer h4');
    const trainSectionTitle = document.querySelector('#train h2');
    const downloadTitle = document.querySelector('#download h4');
    
    // TAB SELECTORS
    const busTabSpan = document.querySelector('.nav-tab-bus span');
    const trainTabSpan = document.querySelector('.nav-tab-train span');

    // Metrics Selectors
    const metricCarousel = document.getElementById('metric-carousel');
    const metricsDots = document.getElementById('metrics-dots');
    
    // HELP MODAL SELECTORS (NEW)
    const submitQueryBtn = document.getElementById('submitQueryBtn');
    const helpQueryModal = new bootstrap.Modal(document.getElementById('helpQueryModal')); // Initialize modal instance

    // --- 2. Data Simulation (Frontend Only) ---
    const DUMMY_CITIES = [
        "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
        "Pune", "Kolkata", "Ahmedabad", "Chandigarh", "Jaipur",
        "Lucknow", "Goa", "Kochi", "Coimbatore", "Mysore",
        "Vijayawada", "Varanasi", "Surat", "Bhopal", "Patna"
    ];

    const METRICS = [
        { value: "36 Million+", label: "Satisfied Customers" },
        { value: "3500+", label: "Bus Operators Worldwide" },
        { value: "220 Million+", label: "Tickets Sold Globally" }
    ];
    let currentMetricIndex = 0;
    let metricInterval;

    // LANGUAGE STRINGS for Simulation
    const LANGUAGES = {
        'English': {
            toggle: 'English', searchBtn: 'SEARCH BUSES', trainSearchBtn: 'SEARCH TRAINS', 
            heroTitle: "India's No. 1 Online Bus Ticket Booking Site",
            offerHeader: 'TRENDING OFFERS', trainTitle: 'NOW, GET MORE THAN JUST BUS TICKETS WITH REDBUS!',
            downloadTitle: 'ENJOY THE APP!', dealsTitle: 'Unlock Your Exclusive redDeal!', dealsFindBtn: 'Find Your Bus Now →',
            busTab: 'Bus Tickets', trainTab: 'Train Tickets'
        },
        'Hindi': {
            toggle: 'हिन्दी', searchBtn: 'बस खोजें', trainSearchBtn: 'ट्रेन खोजें', 
            heroTitle: 'भारत की नंबर 1 ऑनलाइन बस टिकट बुकिंग साइट',
            offerHeader: 'ट्रेंडिंग ऑफर', trainTitle: 'अब, REDBUS के साथ बस टिकट से भी ज़्यादा पाएँ!',
            downloadTitle: 'ऐप का आनंद लें!', dealsTitle: 'अपना विशेष redDeal अनलॉक करें!', dealsFindBtn: 'अपनी बस अभी खोजें →',
            busTab: 'बस टिकट', trainTab: 'ट्रेन टिकट'
        },
        'Tamil': {
            toggle: 'தமிழ்', searchBtn: 'பஸ் தேடல்', trainSearchBtn: 'ரயில் தேடல்', 
            heroTitle: "இந்தியாவின் நம்பர் 1 ஆன்லைன் பஸ் டிக்கெட் முன்பதிவு தளம்",
            offerHeader: 'ட்ரெண்டிங் ஆஃபர்கள்', trainTitle: 'இப்போது, REDBUS உடன் பஸ் டிக்கெட்டுகளை விட அதிகமாகப் பெறுங்கள்!',
            downloadTitle: 'பயன்பாட்டை மகிழுங்கள்!', dealsTitle: 'உங்களின் பிரத்யேக redDeal-ஐத் திறக்கவும்!', dealsFindBtn: 'உங்கள் பஸ்ஸை இப்போதே கண்டுபிடி →',
            busTab: 'பஸ் டிக்கெட்', trainTab: 'ரயில் டிக்கெட்'
        }
    };

    /**
     * Updates key text elements on the page based on the selected language object.
     * @param {string} langKey - The clean key of the selected language (e.g., 'Hindi').
     */
    function updatePageContent(langKey) {
        const lang = LANGUAGES[langKey];
        if (!lang) return;

        // 1. Update Navbar and Tab Text 
        languageDropdownToggle.innerHTML = `<i class="bi bi-translate me-1"></i> ${lang.toggle}`;
        if (busTabSpan) busTabSpan.textContent = lang.busTab;
        if (trainTabSpan) trainTabSpan.textContent = lang.trainTab;

        // 2. Update Major Section Titles/Buttons
        if (heroTitle) heroTitle.textContent = lang.heroTitle;
        if (offerHeader) offerHeader.textContent = lang.offerHeader;
        if (downloadTitle) downloadTitle.textContent = lang.downloadTitle;
        if (dealsBookBtn) dealsBookBtn.textContent = lang.dealsFindBtn;
        
        // Train title logic
        if (trainSectionTitle) {
            trainSectionTitle.innerHTML = lang.trainTitle
                .replace('JUST BUS', `<span class="text-danger">JUST BUS</span>`)
                .replace('REDBUS!', `<span class="text-dark">REDBUS!</span>`);
        }
        
        // Deal title logic
        const dealHeader = document.querySelector('#deals h2');
        if (dealHeader) {
            dealHeader.innerHTML = lang.dealsTitle.replace('redDeal', `<span class="text-dark">redDeal</span>`);
        }

        // 3. Update active state in the dropdown list
        languageDropdownItems.forEach(i => {
            i.classList.remove('active');
            if (i.dataset.lang === langKey) {
                i.classList.add('active');
            }
        });
        
        // 4. Update Search Button text based on active tab AND new language
        const isBusActive = document.querySelector('.nav-tab-bus').classList.contains('active');
        if (searchBtn) {
            searchBtn.textContent = isBusActive ? lang.searchBtn : lang.trainSearchBtn;
        }
    }
    
    // --- HELP QUERY SUBMISSION LOGIC (NEW) ---
    if (submitQueryBtn) {
        submitQueryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Basic form validation (check if required fields are filled)
            const emailInput = document.getElementById('queryEmail');
            const subjectInput = document.getElementById('querySubject');
            const messageInput = document.getElementById('queryMessage');
            
            if (emailInput.value.trim() === "" || subjectInput.value.trim() === "" || messageInput.value.trim() === "") {
                alert("Please fill out all required fields.");
                return;
            }
            
            // Simulate successful submission
            alert(`Query submitted successfully! We'll reach out to ${emailInput.value.trim()} shortly.`);
            
            // Reset form and close modal
            emailInput.value = '';
            subjectInput.value = '';
            messageInput.value = '';
            helpQueryModal.hide();
        });
    }

    // --- 3. LANGUAGE SWITCHING LOGIC ---
    languageDropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const langKey = e.target.dataset.lang;
            if (langKey) {
                updatePageContent(langKey);
            }
        });
    });

    // --- 4. METRICS CAROUSEL LOGIC ---
    function renderMetric(index) {
        if (!metricCarousel || !metricsDots) return;
        const metric = METRICS[index];
        
        metricCarousel.innerHTML = `
            <div class="metric-item active">
                <div class="metric-value">${metric.value}</div>
                <div class="metric-label">${metric.label}</div>
            </div>
        `;
        
        metricsDots.innerHTML = METRICS.map((_, i) => 
            `<span class="dot ${i === index ? 'active' : ''}" data-index="${i}"></span>`
        ).join('');
        
        document.querySelectorAll('#metrics-dots .dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                const newIndex = parseInt(e.target.dataset.index);
                if (newIndex !== currentMetricIndex) {
                    currentMetricIndex = newIndex;
                    clearInterval(metricInterval);
                    renderMetric(currentMetricIndex);
                    startMetricCarousel();
                }
            });
        });
    }

    function startMetricCarousel() {
        metricInterval = setInterval(() => {
            currentMetricIndex = (currentMetricIndex + 1) % METRICS.length;
            renderMetric(currentMetricIndex);
        }, 3000); 
    }
    
    if (metricCarousel) {
        metricCarousel.style.position = 'relative'; 
        renderMetric(currentMetricIndex);
        startMetricCarousel();
    }


    // --- 5. DEAL TIMER AND COPY LOGIC ---
    function startDealTimer() {
        let duration = 3600; 
        
        const timerInterval = setInterval(() => {
            if (duration <= 0) {
                clearInterval(timerInterval);
                if (dealTimerDisplay) dealTimerDisplay.textContent = "EXPIRED";
                return;
            }

            let hours = Math.floor(duration / 3600);
            let minutes = Math.floor((duration % 3600) / 60);
            let seconds = duration % 60;

            const format = num => String(num).padStart(2, '0');

            if (dealTimerDisplay) {
                dealTimerDisplay.textContent = `${format(hours)}:${format(minutes)}:${format(seconds)}`;
            }

            duration--;
        }, 1000);
    }
    
    if (dealTimerDisplay) {
        startDealTimer();
    }

    if (copyCodeBtn && offerCodeInput) {
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            new bootstrap.Tooltip(copyCodeBtn);
        }
        
        copyCodeBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(offerCodeInput.value).then(() => {
                
                if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
                    const originalTitle = copyCodeBtn.getAttribute('title');
                    copyCodeBtn.setAttribute('data-bs-original-title', 'Copied!');
                    
                    const tooltip = bootstrap.Tooltip.getInstance(copyCodeBtn);
                    if (tooltip) {
                        tooltip.show();
                        setTimeout(() => {
                            tooltip.hide();
                            copyCodeBtn.setAttribute('data-bs-original-title', originalTitle);
                        }, 1000);
                    }
                } else {
                    alert("Code Copied: " + offerCodeInput.value);
                }
            }).catch(err => {
                console.error("Could not copy text: ", err);
                alert("Could not copy code. Please try manually.");
            });
        });
    }


    // --- 6. Tab Switching Functionality ---
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.getAttribute('data-tab');
            const activeLangElement = document.querySelector('.dropdown-menu a.dropdown-item.active');
            const currentLangKey = activeLangElement ? activeLangElement.dataset.lang : 'English';
            const lang = LANGUAGES[currentLangKey] || LANGUAGES['English'];

            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            cityInputs.forEach(input => {
                const icon = input.parentElement.querySelector('.city-icon');
                if (tabType === 'bus') {
                    if (searchBtn) searchBtn.textContent = lang.searchBtn; 
                    searchBtn.style.backgroundColor = '#d32f2f'; 
                    
                    if (icon) icon.style.display = 'block'; 
                    input.placeholder = 'From';
                    if (input.dataset.city === 'to') input.placeholder = 'To';
                    
                } else if (tabType === 'train') {
                    if (searchBtn) searchBtn.textContent = lang.trainSearchBtn;
                    
                    searchBtn.style.backgroundColor = '#007bff'; 

                    if (icon) icon.style.display = 'none'; 
                    input.placeholder = 'Source Station';
                    if (input.dataset.city === 'to') input.placeholder = 'Destination Station';
                }
            });
        });
    });

    // --- 7. Simulated Recommendation Functionality ---
    cityInputs.forEach(input => {
        const listElement = document.querySelector(`[data-list="${input.dataset.city}"]`);

        const renderList = (searchTerm) => {
            const matches = DUMMY_CITIES.filter(city => 
                city.toLowerCase().startsWith(searchTerm.toLowerCase())
            ).slice(0, 5);

            listElement.innerHTML = '';
            
            if (searchTerm.length > 0 && matches.length > 0) {
                matches.forEach(city => {
                    const listItem = document.createElement('div');
                    listItem.className = 'list-group-item';
                    listItem.innerHTML = `<i class="bi bi-geo-alt me-2 text-muted"></i> <strong>${city}</strong>`;
                    
                    listItem.addEventListener('mousedown', (e) => {
                        e.preventDefault(); 
                        input.value = city;
                        listElement.classList.add('d-none');
                    });
                    
                    listElement.appendChild(listItem);
                });
                listElement.classList.remove('d-none');
            } else {
                listElement.classList.add('d-none');
            }
        };

        input.addEventListener('input', () => {
            renderList(input.value);
        });
        input.addEventListener('focus', () => {
            renderList(input.value);
        });
        input.addEventListener('blur', () => {
            setTimeout(() => {
                listElement.classList.add('d-none');
            }, 150);
        });
    });

    // --- 8. Swap Icon Functionality ---
    if (swapIcon) {
        swapIcon.addEventListener('click', () => {
            const fromInput = document.querySelector('input[data-city="from"]');
            const toInput = document.querySelector('input[data-city="to"]');
            
            if (fromInput && toInput) {
                const temp = fromInput.value;
                fromInput.value = toInput.value;
                toInput.value = temp;
            }
        });
    }

    // --- 9. "View All/View Less" Offers Toggle Handler ---
    if (viewAllOffersLink && offersContainer) {
        viewAllOffersLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            offersContainer.classList.toggle('offers-expanded');

            const isExpanded = offersContainer.classList.contains('offers-expanded');
            
            if (isExpanded) {
                viewAllOffersLink.textContent = 'View Less';
                document.getElementById('offer').scrollIntoView({ behavior: 'smooth' });
            } else {
                viewAllOffersLink.textContent = 'View All';
                document.getElementById('offer').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --- 10. Search Button Alert ---
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert(`Searching for tickets! (This is a frontend demo)`);
        });
    }

    // --- 11. Book Train Button Action ---
    if (bookTrainBtn) {
        bookTrainBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Redirecting to the Train Booking Tab! (Frontend action)');
            const trainTab = document.querySelector('.nav-tab-train');
            if (trainTab) trainTab.click();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 12. Deals Book Now Button Action ---
    if (dealsBookBtn) {
        dealsBookBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Redirecting to search with offer code applied! (Frontend action)');
            document.getElementById('search').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Initial content load to ensure consistency
    updatePageContent('English');
});