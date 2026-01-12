import React, { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const NewFAQSection = () => {
    const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2 });
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: "How does online therapy work?",
            answer: "Online therapy works just like traditional therapy, but through secure video calls, phone calls, or messaging. You'll be matched with a licensed therapist who specializes in your needs. Sessions are typically 45-60 minutes, and you can communicate with your therapist between sessions through our messaging feature."
        },
        {
            question: "Is online therapy as effective as in-person therapy?",
            answer: "Research consistently shows that online therapy is just as effective as in-person therapy for most mental health conditions, including anxiety, depression, and stress. Many people find they're more comfortable opening up from their own space, which can actually enhance the therapeutic process."
        },
        {
            question: "How do you match me with a therapist?",
            answer: "After you complete our brief assessment questionnaire, our matching algorithm considers your preferences, therapeutic needs, and goals to connect you with the most suitable therapists. You can review their profiles and choose who feels right for you, and you can always switch therapists at no extra cost."
        },
        {
            question: "What if I don't connect with my therapist?",
            answer: "Finding the right therapist is crucial for your progress. If you feel your current match isn't quite right, you can easily switch to a different therapist at any time at no additional cost. We want you to feel completely comfortable with your care provider."
        },
        {
            question: "Is my information kept confidential?",
            answer: "Absolutely. We take your privacy extremely seriously. Our platform is HIPAA-compliant with bank-level encryption. All your sessions and messages are completely confidential. Your therapist is bound by the same legal and ethical obligations as in traditional therapy settings."
        },
        {
            question: "Does insurance cover online therapy?",
            answer: "Currently, insurance does not cover our online therapy services. We do not work with insurance providers at this time. All sessions are self-pay with transparent pricing."
        },
        {
            question: "Can I use this service for crisis situations?",
            answer: "While we provide ongoing therapeutic support, our platform is not designed for crisis intervention. If you're in immediate danger or having thoughts of harming yourself, please call 911 or the National Suicide Prevention Lifeline at 988. We have resources to help connect you with emergency services."
        },
    ];

    return (
        <section className="py-24 bg-white font-nunito relative overflow-hidden">
            {/* Background Decoration */}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div 
                    ref={headerRef}
                    className={`text-center mb-16 transition-all duration-1000 ${
                        headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-customGreen/20 text-customGreen text-sm font-semibold mb-6">
                        <HelpCircle className="w-4 h-4" />
                        Got Questions?
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-700 mb-6">
                        Frequently Asked
                        <span className="text-transparent bg-clip-text bg-customGreen font-averia"> Questions</span>
                    </h2>
                    <p className="text-xl text-gray-600">
                        Everything you need to know about starting your therapy journey.
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem 
                            key={index}
                            faq={faq}
                            index={index}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                        />
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-16 text-center">
                    <p className="text-gray-600 mb-4">Still have questions?</p>
                    <a
                        href="mailto:psychapp@google.com"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-customGreen text-white font-semibold rounded-xl hover:bg-customGreenHover cursor-pointer select-none transition-colors"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </section>
    );
};

const FAQItem = ({ faq, index, isOpen, onClick }) => {
    const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 });

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
        >
            <div className={`rounded-2xl border transition-all duration-300 cursor-pointer ${
                isOpen 
                    ? 'bg-white ' 
                    : 'bg-white border-gray-100 hover:border-gray-200 '
            }`}>
                <button
                    onClick={onClick}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                    <span className={`text-lg font-semibold transition-colors ${
                        isOpen ? 'text-customGreen' : 'text-gray-700'
                    }`}>
                        {faq.question}
                    </span>
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        isOpen 
                            ? 'bg-customGreen text-white rotate-0' 
                            : 'bg-gray-100 text-gray-500 rotate-0'
                    }`}>
                        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </div>
                </button>

                <div className={`overflow-hidden transition-all duration-500 ease-out ${
                    isOpen ? 'max-h-96 pb-6' : 'max-h-0'
                }`}>
                    <div className="px-6 text-gray-600 leading-relaxed">
                        {faq.answer}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewFAQSection;
