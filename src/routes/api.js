const express = require('express');
const router = express.Router();
const FAQ = require('../models/faq');
const cacheMiddleware = require('../middleware/cache');
const translator = require('../utils/translator');

router.get('/faqs', cacheMiddleware, async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const faqs = await FAQ.find();
    const translatedFaqs = faqs.map(faq => ({
      id: faq._id,
      ...faq.getTranslation(lang)
    }));
    res.json(translatedFaqs);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching FAQs' });
  }
});

router.post('/faqs', async (req, res) => {
  try {
    const { question, answer } = req.body;
    const faq = new FAQ({ question, answer });
    await faq.save();
    
    // Translate to supported languages
    const supportedLanguages = ['hi', 'bn'];
    for (const lang of supportedLanguages) {
      const translatedQuestion = await translator.translate(question, lang);
      const translatedAnswer = await translator.translate(answer, lang);
      faq.translations.set(lang, {
        question: translatedQuestion,
        answer: translatedAnswer
      });
    }
    await faq.save();

    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the FAQ' });
  }
});

module.exports = router;