import React, { useState, useCallback } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import type { FAQItem } from '../types';

const AdminFAQPage: React.FC = () => {
    const { faqs, updateFaqs } = useData();
    const [editingItem, setEditingItem] = useState<Partial<FAQItem> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = useCallback((item: FAQItem | null = null) => {
        setEditingItem(item || { question: '', answer: '' });
        setIsModalOpen(true);
    }, []);

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const itemData = {
            question: formData.get('question') as string,
            answer: formData.get('answer') as string,
        };

        if (editingItem && editingItem.id) {
            const updatedItem = { ...editingItem, ...itemData } as FAQItem;
            updateFaqs(faqs.map(item => item.id === editingItem.id ? updatedItem : item));
        } else {
            const newItem = { id: Date.now(), ...itemData };
            updateFaqs([...faqs, newItem]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = useCallback((id: number) => {
        if (window.confirm('Are you sure you want to delete this FAQ?')) {
            updateFaqs(faqs.filter(item => item.id !== id));
        }
    }, [faqs, updateFaqs]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-coffee-dark mb-6">FAQ Management</h1>
            <button onClick={() => openModal()} className="mb-6 bg-coffee-brown text-white font-bold py-2 px-4 rounded-lg hover:bg-coffee-dark transition duration-300">
                Add New FAQ
            </button>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="space-y-4">
                    {faqs.map(item => (
                        <div key={item.id} className="border p-4 rounded-lg">
                            <h3 className="font-bold text-lg text-coffee-dark">{item.question}</h3>
                            <p className="text-gray-600 mt-2">{item.answer}</p>
                            <div className="mt-4 space-x-4">
                                <button onClick={() => openModal(item)} className="text-coffee-brown hover:underline">Edit</button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {editingItem && (
                    <form onSubmit={handleSave} className="p-4 space-y-4">
                        <h2 className="text-2xl font-bold">{editingItem.id ? 'Edit' : 'Add'} FAQ</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Question</label>
                            <input name="question" defaultValue={editingItem.question} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Answer</label>
                            <textarea name="answer" defaultValue={editingItem.answer} required rows={5} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                            <button type="submit" className="bg-coffee-brown text-white font-bold py-2 px-4 rounded-lg">Save</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default AdminFAQPage;