document.addEventListener('DOMContentLoaded', () => {
    CKEDITOR.replace('answer');
  
    const faqForm = document.getElementById('faqForm');
    const faqList = document.getElementById('faqList');
  
    faqForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const question = document.getElementById('question').value;
      const answer = CKEDITOR.instances.answer.getData();
  
      try {
        const response = await fetch('/api/faqs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question, answer }),
        });
  
        if (response.ok) {
          alert('FAQ added successfully');
          faqForm.reset();
          CKEDITOR.instances.answer.setData('');
          loadFAQs();
        } else {
          alert('Error adding FAQ');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
      }
    });
  
    async function loadFAQs() {
      try {
        const response = await fetch('/api/faqs');
        const faqs = await response.json();
        faqList.innerHTML = faqs.map(faq => `
          <div>
            <h3>${faq.question}</h3>
            <div>${faq.answer}</div>
          </div>
        `).join('');
      } catch (error) {
        console.error('Error loading FAQs:', error);
      }
    }
  
    loadFAQs();
  });