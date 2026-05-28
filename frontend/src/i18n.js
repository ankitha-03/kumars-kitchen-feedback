import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {

    /* ════════════════════════════════════════════
       ENGLISH
    ════════════════════════════════════════════ */
    en: { translation: {
      /* LandingPage */
      welcome:          'Welcome!',
      tasteWithLove:    'Taste with Love',
      chefAndOwner:     'Chef & Owner',
      chefWelcomeMsg:   '"Welcome! Every dish here is made with love and fresh ingredients. Your honest feedback helps us serve you better."',
      weServe:          'We serve',
      anonymous:        'Your feedback is 100% anonymous',
      noLoginNoData:    'no login, no personal data collected',
      giveFeedback:     'Give Feedback',
      takesLessMinute:  'Takes less than a minute',

      /* MenuPage */
      selectDish:           'Select a dish to review',
      tableLabel:           'Table',
      itemsAvailable:       'items available',
      tapToReview:          'Tap to review',
      allFeedbackAnonymous: 'All feedback is anonymous',
      loading:              'Loading menu...',

      /* Dish categories (for tabs & badges) */
      dishCategories: {
        All:       'All',
        Breakfast: 'Breakfast',
        Lunch:     'Lunch',
        Chinese:   'Chinese',
        Sides:     'Sides',
        Drinks:    'Drinks',
      },

      /* Error / retry */
      errorBackend:  'Backend not reachable. Is your server running?',
      errorLoadMenu: 'Could not load menu.',
      retry:         'Try Again',
      somethingWrong: 'Something went wrong. Please try again.',

      /* FeedbackPage */
      rateYourDish:        'Rate Your Dish',
      howWasItOverall:     'How was it overall?',
      tapAStar:            'Tap a star',
      veryBad:             'Very Bad',
      belowAverage:        'Below Average',
      okay:                'Okay',
      good:                'Good',
      excellent:           'Excellent!',
      whatIssue:           "What's the issue?",
      tellMore:            'Tell us more (optional)',
      describeExperience:  'Describe your experience...',
      uploadPhoto:         'Upload a photo (optional)',
      photoSelected:       'photo selected',
      submit:              'Submit Feedback',
      submitting:          'Submitting...',
      pleaseGiveRating:    'Please give a star rating',
      pleaseSelectCategory:'Please select a category',
      voiceInputStart:     'Tap to speak',
      voiceInputStop:      'Listening… tap to stop',
      voiceInputUnsupported: 'Voice input not supported in this browser',
      speakButton:         'Speak (English)',
      listeningText:       'Listening...',
      speechNotSupported:  'Voice input not supported on this browser. Please use Chrome.',
      speechError:         'Could not hear you. Please try again.',
      requiresInternet:    'Requires internet',

      /* Feedback categories */
      categories: {
        Hygiene: 'Hygiene',
        Taste:   'Taste',
        Service: 'Service',
        Pricing: 'Pricing',
      },

      /* ThankYouPage */
      thankYou:        'Thank you for your feedback!',
      recorded:        'Your response has been recorded anonymously.',
      feedbackHelps:   'Your feedback helps Beena Pradhan improve every dish!',
      backHome:        'Back to Home',
      yourReward:      'Your Reward',
      get:             'Get',
      offNextVisit:    'off on your next visit at Kumar\'s Kitchen!',
      showAtCounter:   'Show this code at the counter before ordering',
      beenaSays:       'says:',
      beenaThankYouMsg:'"Thank you for helping us grow! See you soon."',

      /* Sentiment labels */
      sentiment: {
        Positive: 'Positive',
        Neutral:  'Neutral',
        Negative: 'Negative',
      },

      /* Status labels */
      status: {
        Open:           'Open',
        'Under Review': 'Under Review',
        Resolved:       'Resolved',
      },

      /* Admin Dashboard */
      admin: {
        title:              "Kumar's Kitchen — Admin",
        liveRefresh:        'Live dashboard · refreshes every 15s',
        exportCSV:          'Export CSV',
        tabOverview:        'Overview',
        tabTrends:          'Trends',
        tabQR:              'QR Codes',
        tabFeedback:        'All Feedback',
        totalFeedback:      'Total Feedback',
        avgRating:          'Avg Rating',
        positive:           'Positive',
        negative:           'Negative',
        bestThisWeek:       'BEST THIS WEEK',
        needsAttention:     'NEEDS ATTENTION',
        complaintsWeek:     'complaints this week',
        avgLabel:           'avg',
        sentimentChart:     'Sentiment',
        categoryChart:      'By Category',
        mostReviewed:       'Most Reviewed Dishes',
        total:              'total',
        leaderboard:        'Dish Rating Leaderboard',
        reviews:            'reviews',
        ratingBadge:        'Avg Rating',
        last7Days:          'Last 7 Days — Feedback Trend',
        spotPatterns:       'Spot patterns — good days vs bad days',
        printInstructions:  'Print and laminate these. Place one per table. Scanning opens the feedback form instantly.',
        printAll:           'Print All QR Codes',
        updateBaseUrl:      'After deploying live, update BASE_URL in AdminDashboard.jsx to your real URL',
        allSentiment:       'All Sentiment',
        allCategories:      'All Categories',
        entries:            'entries',
        export:             'Export',
        noFeedback:         'No feedback found.',
        reviewing:          'Reviewing',
        resolvedBtn:        'Resolved',
        reopenBtn:          '↩ Reopen',
        newComplaintFor:    'New complaint for',
        searchPlaceholder:  'Search by dish or keyword...',
        unknown:            'Unknown dish',
        negativeAlert:      '',
      },
    }},

    /* ════════════════════════════════════════════
       HINDI
    ════════════════════════════════════════════ */
    hi: { translation: {
      /* LandingPage */
      welcome:          'स्वागत है!',
      tasteWithLove:    'प्यार के साथ स्वाद',
      chefAndOwner:     'शेफ और मालकिन',
      chefWelcomeMsg:   '"स्वागत है! यहाँ हर व्यंजन प्यार और ताज़े सामग्री से बनाया गया है। आपकी ईमानदार प्रतिक्रिया हमें बेहतर सेवा करने में मदद करती है।"',
      weServe:          'हम परोसते हैं',
      anonymous:        'आपकी प्रतिक्रिया 100% गुमनाम है',
      noLoginNoData:    'कोई लॉगिन नहीं, कोई व्यक्तिगत डेटा नहीं',
      giveFeedback:     'फ़ीडबैक दें',
      takesLessMinute:  'एक मिनट से कम लगता है',

      /* MenuPage */
      selectDish:           'समीक्षा के लिए डिश चुनें',
      tableLabel:           'मेज',
      itemsAvailable:       'आइटम उपलब्ध',
      tapToReview:          'समीक्षा करें',
      allFeedbackAnonymous: 'सभी प्रतिक्रियाएँ गुमनाम हैं',
      loading:              'मेनू लोड हो रहा है...',

      /* Dish categories */
      dishCategories: {
        All:       'सभी',
        Breakfast: 'नाश्ता',
        Lunch:     'दोपहर का भोजन',
        Chinese:   'चायनीज़',
        Sides:     'साइड डिश',
        Drinks:    'पेय',
      },

      /* Error / retry */
      errorBackend:  'सर्वर से कनेक्ट नहीं हो सका। क्या आपका सर्वर चल रहा है?',
      errorLoadMenu: 'मेनू लोड नहीं हो सका।',
      retry:         'फिर प्रयास करें',
      somethingWrong: 'कुछ गलत हो गया। कृपया फिर प्रयास करें।',

      /* FeedbackPage */
      rateYourDish:        'अपनी डिश को रेट करें',
      howWasItOverall:     'कुल मिलाकर कैसा था?',
      tapAStar:            'स्टार टैप करें',
      veryBad:             'बहुत बुरा',
      belowAverage:        'औसत से नीचे',
      okay:                'ठीक है',
      good:                'अच्छा',
      excellent:           'उत्कृष्ट!',
      whatIssue:           'समस्या क्या है?',
      tellMore:            'और बताएं (वैकल्पिक)',
      describeExperience:  'अपना अनुभव बताएं...',
      uploadPhoto:         'फोटो अपलोड करें (वैकल्पिक)',
      photoSelected:       'फोटो चुनी गई',
      submit:              'फ़ीडबैक जमा करें',
      submitting:          'जमा हो रहा है...',
      pleaseGiveRating:    'कृपया स्टार रेटिंग दें',
      pleaseSelectCategory:'कृपया एक श्रेणी चुनें',
      voiceInputStart:     'बोलने के लिए टैप करें',
      voiceInputStop:      'सुन रहा है… रोकने के लिए टैप करें',
      voiceInputUnsupported: 'इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है',
      speakButton:         'बोलें (हिंदी)',
      listeningText:       'सुन रहा है...',
      speechNotSupported:  'इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। कृपया Chrome उपयोग करें।',
      speechError:         'आपकी आवाज़ नहीं सुनाई दी। कृपया पुनः प्रयास करें।',
      requiresInternet:    'इंटरनेट आवश्यक है',

      /* Feedback categories */
      categories: {
        Hygiene: 'स्वच्छता',
        Taste:   'स्वाद',
        Service: 'सेवा',
        Pricing: 'मूल्य',
      },

      /* ThankYouPage */
      thankYou:        'आपके फ़ीडबैक के लिए धन्यवाद!',
      recorded:        'आपकी प्रतिक्रिया गुमनाम रूप से दर्ज की गई है।',
      feedbackHelps:   'आपकी प्रतिक्रिया Beena Pradhan को हर व्यंजन सुधारने में मदद करती है!',
      backHome:        'होम पर वापस जाएं',
      yourReward:      'आपका इनाम',
      get:             'पाएं',
      offNextVisit:    "की छूट Kumar's Kitchen में आपकी अगली यात्रा पर!",
      showAtCounter:   'ऑर्डर करने से पहले काउंटर पर यह कोड दिखाएं',
      beenaSays:       'कहती हैं:',
      beenaThankYouMsg:'"हमें बढ़ने में मदद करने के लिए धन्यवाद! जल्द ही मिलते हैं।"',

      /* Sentiment labels */
      sentiment: {
        Positive: 'सकारात्मक',
        Neutral:  'तटस्थ',
        Negative: 'नकारात्मक',
      },

      /* Status labels */
      status: {
        Open:           'खुला',
        'Under Review': 'समीक्षाधीन',
        Resolved:       'हल किया गया',
      },

      /* Admin Dashboard */
      admin: {
        title:              "Kumar's Kitchen — व्यवस्थापक",
        liveRefresh:        'लाइव डैशबोर्ड · हर 15 सेकंड में',
        exportCSV:          'CSV निर्यात',
        tabOverview:        'सिंहावलोकन',
        tabTrends:          'रुझान',
        tabQR:              'QR कोड',
        tabFeedback:        'सभी फ़ीडबैक',
        totalFeedback:      'कुल फ़ीडबैक',
        avgRating:          'औसत रेटिंग',
        positive:           'सकारात्मक',
        negative:           'नकारात्मक',
        bestThisWeek:       'इस सप्ताह सर्वश्रेष्ठ',
        needsAttention:     'ध्यान की ज़रूरत',
        complaintsWeek:     'इस सप्ताह शिकायतें',
        avgLabel:           'औसत',
        sentimentChart:     'भावना',
        categoryChart:      'श्रेणी अनुसार',
        mostReviewed:       'सबसे अधिक समीक्षित व्यंजन',
        total:              'कुल',
        leaderboard:        'डिश रेटिंग लीडरबोर्ड',
        reviews:            'समीक्षाएँ',
        ratingBadge:        'औसत रेटिंग',
        last7Days:          'पिछले 7 दिन — फ़ीडबैक रुझान',
        spotPatterns:       'पैटर्न देखें — अच्छे दिन बनाम बुरे दिन',
        printInstructions:  'इन्हें प्रिंट करें और लैमिनेट करें। प्रत्येक मेज पर एक रखें। स्कैन करने पर फ़ीडबैक फॉर्म खुलता है।',
        printAll:           'सभी QR कोड प्रिंट करें',
        updateBaseUrl:      'लाइव डिप्लॉय के बाद AdminDashboard.jsx में BASE_URL अपडेट करें',
        allSentiment:       'सभी भावनाएँ',
        allCategories:      'सभी श्रेणियाँ',
        entries:            'प्रविष्टियाँ',
        export:             'निर्यात',
        noFeedback:         'कोई फ़ीडबैक नहीं मिला।',
        reviewing:          'समीक्षा',
        resolvedBtn:        'हल किया',
        reopenBtn:          '↩ फिर खोलें',
        newComplaintFor:    'नई शिकायत',
        searchPlaceholder:  'डिश या कीवर्ड से खोजें...',
        unknown:            'अज्ञात व्यंजन',
        negativeAlert:      '',
      },
    }},

    /* ════════════════════════════════════════════
       KANNADA
    ════════════════════════════════════════════ */
    kn: { translation: {
      /* LandingPage */
      welcome:          'ಸ್ವಾಗತ!',
      tasteWithLove:    'ಪ್ರೀತಿಯೊಂದಿಗೆ ರುಚಿ',
      chefAndOwner:     'ಶೆಫ್ ಮತ್ತು ಮಾಲಕ',
      chefWelcomeMsg:   '"ಸ್ವಾಗತ! ಇಲ್ಲಿ ಪ್ರತಿ ಖಾದ್ಯವನ್ನು ಪ್ರೀತಿ ಮತ್ತು ತಾಜಾ ಪದಾರ್ಥಗಳಿಂದ ತಯಾರಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ಪ್ರಾಮಾಣಿಕ ಪ್ರತಿಕ್ರಿಯೆ ನಮಗೆ ಉತ್ತಮ ಸೇವೆ ನೀಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ."',
      weServe:          'ನಾವು ಬಡಿಸುತ್ತೇವೆ',
      anonymous:        'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ 100% ಅನಾಮಧೇಯ',
      noLoginNoData:    'ಯಾವುದೇ ಲಾಗಿನ್ ಇಲ್ಲ, ವೈಯಕ್ತಿಕ ಡೇಟಾ ಇಲ್ಲ',
      giveFeedback:     'ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿ',
      takesLessMinute:  'ಒಂದು ನಿಮಿಷಕ್ಕಿಂತ ಕಡಿಮೆ',

      /* MenuPage */
      selectDish:           'ವಿಮರ್ಶಿಸಲು ಖಾದ್ಯ ಆಯ್ಕೆ ಮಾಡಿ',
      tableLabel:           'ಮೇಜು',
      itemsAvailable:       'ಐಟಂಗಳು ಲಭ್ಯ',
      tapToReview:          'ವಿಮರ್ಶಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
      allFeedbackAnonymous: 'ಎಲ್ಲಾ ಪ್ರತಿಕ್ರಿಯೆಗಳು ಅನಾಮಧೇಯ',
      loading:              'ಮೆನು ಲೋಡ್ ಆಗುತ್ತಿದೆ...',

      /* Dish categories */
      dishCategories: {
        All:       'ಎಲ್ಲ',
        Breakfast: 'ಉಪಾಹಾರ',
        Lunch:     'ಮಧ್ಯಾಹ್ನದ ಊಟ',
        Chinese:   'ಚೈನೀಸ್',
        Sides:     'ಸೈಡ್ ಡಿಶ್',
        Drinks:    'ಪಾನೀಯ',
      },

      /* Error / retry */
      errorBackend:  'ಸರ್ವರ್ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿಲ್ಲ. ನಿಮ್ಮ ಸರ್ವರ್ ಚಲಿಸುತ್ತಿದೆಯೇ?',
      errorLoadMenu: 'ಮೆನು ಲೋಡ್ ಆಗಲಿಲ್ಲ.',
      retry:         'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
      somethingWrong: 'ಏನೋ ತಪ್ಪಾಯಿತು. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

      /* FeedbackPage */
      rateYourDish:        'ನಿಮ್ಮ ಖಾದ್ಯವನ್ನು ರೇಟ್ ಮಾಡಿ',
      howWasItOverall:     'ಒಟ್ಟಾರೆ ಹೇಗಿತ್ತು?',
      tapAStar:            'ನಕ್ಷತ್ರ ಟ್ಯಾಪ್ ಮಾಡಿ',
      veryBad:             'ತುಂಬಾ ಕೆಟ್ಟದು',
      belowAverage:        'ಸರಾಸರಿಗಿಂತ ಕಡಿಮೆ',
      okay:                'ಸರಿ',
      good:                'ಚೆನ್ನಾಗಿದೆ',
      excellent:           'ಅತ್ಯುತ್ತಮ!',
      whatIssue:           'ಸಮಸ್ಯೆ ಏನು?',
      tellMore:            'ಇನ್ನಷ್ಟು ಹೇಳಿ (ಐಚ್ಛಿಕ)',
      describeExperience:  'ನಿಮ್ಮ ಅನುಭವ ವಿವರಿಸಿ...',
      uploadPhoto:         'ಫೋಟೋ ಅಪ್ಲೋಡ್ ಮಾಡಿ (ಐಚ್ಛಿಕ)',
      photoSelected:       'ಫೋಟೋ ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ',
      submit:              'ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿ',
      submitting:          'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...',
      pleaseGiveRating:    'ದಯವಿಟ್ಟು ನಕ್ಷತ್ರ ರೇಟಿಂಗ್ ನೀಡಿ',
      pleaseSelectCategory:'ದಯವಿಟ್ಟು ಒಂದು ವರ್ಗ ಆಯ್ಕೆ ಮಾಡಿ',
      voiceInputStart:     'ಮಾತಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
      voiceInputStop:      'ಆಲಿಸುತ್ತಿದೆ… ನಿಲ್ಲಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
      voiceInputUnsupported: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ',
      speakButton:         'ಮಾತನಾಡಿ (ಕನ್ನಡ)',
      listeningText:       'ಆಲಿಸುತ್ತಿದೆ...',
      speechNotSupported:  'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ವಾಯ್ಸ್ ಇನ್‌ಪುಟ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು Chrome ಬಳಸಿ.',
      speechError:         'ನಿಮ್ಮ ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
      requiresInternet:    'ಇಂಟರ್ನೆಟ್ ಅಗತ್ಯವಿದೆ',

      /* Feedback categories */
      categories: {
        Hygiene: 'ನೈರ್ಮಲ್ಯ',
        Taste:   'ರುಚಿ',
        Service: 'ಸೇವೆ',
        Pricing: 'ಬೆಲೆ',
      },

      /* ThankYouPage */
      thankYou:        'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಗೆ ಧನ್ಯವಾದ!',
      recorded:        'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಅನಾಮಧೇಯವಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ.',
      feedbackHelps:   'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ Beena Pradhan ಅವರಿಗೆ ಪ್ರತಿ ಖಾದ್ಯ ಸುಧಾರಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ!',
      backHome:        'ಮನೆಗೆ ಹಿಂತಿರುಗಿ',
      yourReward:      'ನಿಮ್ಮ ಬಹುಮಾನ',
      get:             'ಪಡೆಯಿರಿ',
      offNextVisit:    "Kumar's Kitchen ನಲ್ಲಿ ನಿಮ್ಮ ಮುಂದಿನ ಭೇಟಿಗೆ ರಿಯಾಯಿತಿ!",
      showAtCounter:   'ಆರ್ಡರ್ ಮಾಡುವ ಮೊದಲು ಕೌಂಟರ್‌ನಲ್ಲಿ ಈ ಕೋಡ್ ತೋರಿಸಿ',
      beenaSays:       'ಹೇಳುತ್ತಾರೆ:',
      beenaThankYouMsg:'"ನಮ್ಮ ಬೆಳವಣಿಗೆಗೆ ಸಹಾಯ ಮಾಡಿದಕ್ಕೆ ಧನ್ಯವಾದ! ಶೀಘ್ರದಲ್ಲೇ ಭೇಟಿಯಾಗೋಣ."',

      /* Sentiment labels */
      sentiment: {
        Positive: 'ಸಕಾರಾತ್ಮಕ',
        Neutral:  'ತಟಸ್ಥ',
        Negative: 'ನಕಾರಾತ್ಮಕ',
      },

      /* Status labels */
      status: {
        Open:           'ತೆರೆದಿದೆ',
        'Under Review': 'ಪರಿಶೀಲನೆಯಲ್ಲಿ',
        Resolved:       'ಪರಿಹರಿಸಲಾಗಿದೆ',
      },

      /* Admin Dashboard */
      admin: {
        title:              "Kumar's Kitchen — ನಿರ್ವಾಹಕ",
        liveRefresh:        'ಲೈವ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ · ಪ್ರತಿ 15 ಸೆಕೆಂಡಿಗೆ',
        exportCSV:          'CSV ರಫ್ತು',
        tabOverview:        'ಸಾರಾಂಶ',
        tabTrends:          'ಪ್ರವೃತ್ತಿ',
        tabQR:              'QR ಕೋಡ್',
        tabFeedback:        'ಎಲ್ಲಾ ಪ್ರತಿಕ್ರಿಯೆ',
        totalFeedback:      'ಒಟ್ಟು ಪ್ರತಿಕ್ರಿಯೆ',
        avgRating:          'ಸರಾಸರಿ ರೇಟಿಂಗ್',
        positive:           'ಸಕಾರಾತ್ಮಕ',
        negative:           'ನಕಾರಾತ್ಮಕ',
        bestThisWeek:       'ಈ ವಾರ ಅತ್ಯುತ್ತಮ',
        needsAttention:     'ಗಮನ ಬೇಕಾಗಿದೆ',
        complaintsWeek:     'ಈ ವಾರ ದೂರುಗಳು',
        avgLabel:           'ಸರಾಸರಿ',
        sentimentChart:     'ಭಾವನೆ',
        categoryChart:      'ವರ್ಗ ಪ್ರಕಾರ',
        mostReviewed:       'ಹೆಚ್ಚು ವಿಮರ್ಶಿಸಲಾದ ಖಾದ್ಯಗಳು',
        total:              'ಒಟ್ಟು',
        leaderboard:        'ಖಾದ್ಯ ರೇಟಿಂಗ್ ಲೀಡರ್‌ಬೋರ್ಡ್',
        reviews:            'ವಿಮರ್ಶೆಗಳು',
        ratingBadge:        'ಸರಾಸರಿ ರೇಟಿಂಗ್',
        last7Days:          'ಕಳೆದ 7 ದಿನಗಳು — ಪ್ರತಿಕ್ರಿಯೆ ಪ್ರವೃತ್ತಿ',
        spotPatterns:       'ಮಾದರಿಗಳನ್ನು ಗುರುತಿಸಿ — ಒಳ್ಳೆಯ ದಿನಗಳು ಮತ್ತು ಕೆಟ್ಟ ದಿನಗಳು',
        printInstructions:  'ಇವುಗಳನ್ನು ಮುದ್ರಿಸಿ ಮತ್ತು ಲ್ಯಾಮಿನೇಟ್ ಮಾಡಿ. ಪ್ರತಿ ಮೇಜಿಗೆ ಒಂದು ಇರಿಸಿ. ಸ್ಕ್ಯಾನ್ ಮಾಡಿದಾಗ ಪ್ರತಿಕ್ರಿಯೆ ಫಾರ್ಮ್ ತೆರೆಯುತ್ತದೆ.',
        printAll:           'ಎಲ್ಲಾ QR ಕೋಡ್‌ಗಳನ್ನು ಮುದ್ರಿಸಿ',
        updateBaseUrl:      'ಲೈವ್ ಡಿಪ್ಲಾಯ್ ನಂತರ AdminDashboard.jsx ನಲ್ಲಿ BASE_URL ಅಪ್‌ಡೇಟ್ ಮಾಡಿ',
        allSentiment:       'ಎಲ್ಲಾ ಭಾವನೆಗಳು',
        allCategories:      'ಎಲ್ಲಾ ವರ್ಗಗಳು',
        entries:            'ನಮೂದುಗಳು',
        export:             'ರಫ್ತು',
        noFeedback:         'ಯಾವುದೇ ಪ್ರತಿಕ್ರಿಯೆ ಕಂಡುಬಂದಿಲ್ಲ.',
        reviewing:          'ಪರಿಶೀಲನೆ',
        resolvedBtn:        'ಪರಿಹರಿಸಲಾಗಿದೆ',
        reopenBtn:          '↩ ಮತ್ತೆ ತೆರೆಯಿರಿ',
        newComplaintFor:    'ಹೊಸ ದೂರು',
        searchPlaceholder:  'ಖಾದ್ಯ ಅಥವಾ ಕೀವರ್ಡ್‌ನಿಂದ ಹುಡುಕಿ...',
        unknown:            'ಅಜ್ಞಾತ ಖಾದ್ಯ',
        negativeAlert:      '',
      },
    }},
  },
});

export default i18n;
