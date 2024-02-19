

//Configs extracted from README for reusability: Easier updates, less code duplication.
// These config used in processElementLinks function and processBrick function
const classNameForParagraphsConfig=["title", "price", "description"]
const tagMappingToClassConfig = {
    i: ["con-button"],
    b: ["con-button", "blue"]
  };
const FAQ = [
    {
        q: "How much does Photoshop cost?",
        a: "Plans start at US$22.99/mo."
    },
    {
        q: "Can you use Photoshop to edit videos?",
        a: "Yes, you can use Photoshop to edit videos."
    },
    {
        q: "Is Photoshop available without a subscription?",
        a: "Photoshop is only available as part of a Creative Cloud plan, which includes the latest features, updates, fonts, and more."
    }
];

function processBackgroundColor(el) {
    if (!el.firstElementChild) return; // Ensure there's a first child
    el.style.background = el.firstElementChild.textContent.trim();
    el.removeChild(el.firstElementChild);
}
// I've already used console.error for error handelling in functions to continue debuging.
// We should `throw new Error` in production environments for more robust error handling.
// This approach would allow for centralized error catching and potentially provide a better user experience

// Function to process elements with links and styles
function processElementLinks(paragraphs) {
    if (!paragraphs) {
      console.error('processElementLinks: No paragraphs provided');
      return;
    } 
    paragraphs.forEach(paragraph => {
      paragraph.querySelectorAll('a').forEach(link => {
        const parentTag = link.closest(Object.keys(tagMappingToClassConfig).join(','));
  
        if (parentTag) {
          const classList = tagMappingToClassConfig[parentTag.tagName.toLowerCase()];
          if (classList) {
            classList.forEach(actionClassname => {
              link.classList.add(actionClassname);
            });
            parentTag.before(link);
            parentTag.remove();
          }
        }
      });
    });
  }
function processHero(el) {
    if (!el) {
        console.error('processHero: No element provided');
        return;
    }
    processBackgroundColor(el);
    const paragraphs = el.querySelectorAll('p');
    paragraphs.forEach(p => p.querySelector('a') && p.classList.add('action-area'));
    processElementLinks(paragraphs); 
}

function processBrick(el) {
    if (!el) {
      console.error('processBrick: No element provided');
      return;
    }
    processBackgroundColor(el);
    const paragraphs = [...el.querySelectorAll('p')];
    const minNumberOfParagraphs = classNameForParagraphsConfig.length;
    if (paragraphs.length < minNumberOfParagraphs) {
      console.error(`Brick div does not contain ${minNumberOfParagraphs} paragraphs.`);
      return;
    }
    paragraphs.forEach((paragraph, index) => {
      paragraph.classList.add(classNameForParagraphsConfig[index]);
    });
  }

// Function throttle to help reduce the workload during scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}
function processBanner(el) {
    processElementLinks([el]); 
    const hero = document.querySelector('.hero');
    const toggleBannerVisibility = () => {
        const heroRect = hero.getBoundingClientRect();
        
        if (heroRect.top + heroRect.height < 0) {
            el.classList.add('sticky-banner'); 
            el.style.display = 'block';
        } else {
            el.classList.remove('sticky-banner'); 
            el.style.display = 'none';
        }
    };
    window.addEventListener('scroll', throttle(toggleBannerVisibility, 100));
}

function processFaq(el) {
    // Insert the FAQ content
    el.innerHTML = `<div class="faq-container">${
        FAQ.map(faq => `
            <div class="faq-set">
                <div class="question" tabindex="0" aria-expanded="false"><h3>${faq.q}</h3></div>
                <div class="answer" style="display: none;"><p>${faq.a}</p></div>
            </div>`
        ).join('')
    }</div>`;
    el.addEventListener('click', event => {
        const clickedQuestion = event.target.closest('.question');
        if (!clickedQuestion) return;

        const clickedAnswer = clickedQuestion.nextElementSibling;
        const isExpanded = clickedQuestion.getAttribute('aria-expanded') === 'true';
        clickedQuestion.classList.toggle('rotated', !isExpanded);
        clickedQuestion.setAttribute('aria-expanded', String(!isExpanded));
        clickedAnswer.style.display = isExpanded ? 'none' : 'block';

        const allQuestions = el.querySelectorAll('.question');
        allQuestions.forEach(question => {
            if (question !== clickedQuestion) {
                const answer = question.nextElementSibling;
                if (question.getAttribute('aria-expanded') === 'true') {
                    question.classList.remove('rotated');
                    question.setAttribute('aria-expanded', 'false');
                    answer.style.display = 'none';
                }
            }
        });
    });
}
document.querySelectorAll('.hero').forEach(processHero);
document.querySelectorAll('.brick').forEach(processBrick);
document.querySelectorAll('.faq').forEach(processFaq);
document.querySelectorAll('.banner').forEach(processBanner);