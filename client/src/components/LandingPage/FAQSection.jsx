import React, { useState } from 'react';

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How much is PsychApp online therapy?",
            answer: "PsychApp offers various subscription plans starting from $69 per week, depending on the level of care and frequency of sessions you choose. Insurance coverage may also be available to reduce costs."
        },
        {
            question: "Does insurance cover online therapy?",
            answer: "Many insurance plans do cover PsychApp online therapy. We accept various insurance providers, and you can check your eligibility during the sign-up process to see if your plan is covered."
        },
        {
            question: "Is online therapy effective?",
            answer: "Yes, research shows that online therapy can be just as effective as in-person therapy for many mental health conditions, including anxiety, depression, and stress management."
        },
        {
            question: "What is the difference between therapy and psychiatry?",
            answer: "Therapy involves talk-based treatment with a licensed therapist to address emotional and behavioral issues. Psychiatry is provided by medical doctors who can diagnose mental health conditions and prescribe medication when needed."
        },
        {
            question: "How do I get matched with a therapist?",
            answer: "After signing up, you'll complete a brief assessment about your needs, preferences, and goals. Our matching algorithm will then connect you with a licensed therapist who specializes in your areas of concern."
        }
    ];

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-lightGreen py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col mb-8 sm:mb-12 text-center lg:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-averia text-customGreen mb-3 sm:mb-4">
                        Any questions?
                    </h1>
                    <p className="text-customGreen text-base sm:text-lg mb-8 sm:mb-12 font-nunito tracking-tighter px-4 sm:px-0">
                        Find trust-worthy answers on all things mental health at PsychApp.
                    </p>
                </div>

                <div className='flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12'>
                    {/* Illustration */}
                    <div className='w-full lg:w-1/2 flex justify-center lg:justify-start'>
                        <img src="/helpingHand.png" alt="FAQ Illustration" className="w-full max-w-md lg:max-w-lg h-auto" />
                    </div>

                    {/* FAQ Accordion */}
                    <div className="space-y-0 w-full lg:w-1/2">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-customGreen">
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full py-4 sm:py-6 flex justify-between items-center text-left hover:opacity-80 transition-opacity cursor-pointer"
                                >
                                    <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-averia text-customGreen pr-4 sm:pr-8">
                                        {faq.question}
                                    </span>
                                    <span className="text-2xl sm:text-3xl text-customGreen shrink-0 transition-transform duration-300"
                                        style={{ transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                                        +
                                    </span>
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-4 sm:pb-6' : 'max-h-0'
                                        }`}
                                >
                                    <p className="text-customGreen font-nunito tracking-tighter text-base sm:text-lg leading-relaxed pr-8">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}