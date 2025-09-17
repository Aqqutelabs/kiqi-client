"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

export default function FAQ() {
  const [query, setQuery] = useState("");
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const faqData = [
    {
        id: 1,
      question: "How does Kiqi work?",
      answer:
        "KiQi includes a payment feature that supports bank transfers and card payments worldwide. You will receive the money in your bank account immediately the payment is made (transaction fees apply, see subscription plans for more info).",
    },
    {
        id: 2,
      question: "How will I know when a customer places an order?",
      answer:
        "KiQi includes a payment feature that supports bank transfers and card payments worldwide. You will receive the money in your bank account immediately the payment is made (transaction fees apply, see subscription plans for more info).",
    },
    {
        id: 3,
      question: "What if I have multiple businesses?",
      answer:
        "KiQi includes a payment feature that supports bank transfers and card payments worldwide. You will receive the money in your bank account immediately the payment is made (transaction fees apply, see subscription plans for more info).",
    },
    {
        id: 4,
      question: "How do my customers make payment?",
      answer:
        "KiQi includes a payment feature that supports bank transfers and card payments worldwide. You will receive the money in your bank account immediately the payment is made (transaction fees apply, see subscription plans for more info).",
    },
  ];

  const [ openQuestionId, setOpenQuestionId ] = useState<number | null>(null);

    const toggleFAQ = (id: null | number) => {
        setOpenQuestionId(openQuestionId === id ? null : id)
    }

  return (
    <div className="space-y-8 my-10 flex flex-col justify-center items-center md:items-start">
      <h1 className="text-[#111111] text-[52px] font-bold">FAQ</h1>
      <div className="space-y-2 w-full md:w-[800px]">
        {faqData.map((faq) => (
          <details
            key={faq.id}
            onClick={() => toggleFAQ(faq.id)}
            className="flex flex-col px-[15px] py-[7px] group border-b border-black"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-6 py-2 transition-all duration-200 ease-in-out">
              <p className="text-lg md:text-2xl font-medium leading-normal">
                {faq.question}
              </p>
              <FaPlus className={`transform transition-transform duration-200 ${ openQuestionId === faq.id && 'rotate-45'} hover:cursor-pointer text-xl`}/>
            </summary>
            <p className="text-sm md:text-lg font-normal leading-normal pb-2">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
