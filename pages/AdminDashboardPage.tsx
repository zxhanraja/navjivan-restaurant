import React from 'react';
import { useData } from '../context/DataContext';
import StatCard from '../components/StatCard';
import PieChart from '../components/PieChart';

const AdminDashboardPage: React.FC = () => {
    const { menuItems, reviews, offers, menuCategories } = useData();

    const pendingReviewsCount = reviews.filter(r => r.status === 'pending').length;

    const menuByCategoryData = {
        labels: menuCategories,
        values: menuCategories.map(cat => menuItems.filter(item => item.category === cat).length),
    };

    const icons = {
        menu: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
        reviews: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>,
        offers: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>,
        categories: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-coffee-dark mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 mb-8">Welcome back! Here's a summary of your restaurant's status.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard icon={icons.menu} title="Total Menu Items" value={menuItems.length} linkTo="/admin/menu" />
                <StatCard icon={icons.reviews} title="Pending Reviews" value={pendingReviewsCount} linkTo="/admin/reviews" />
                <StatCard icon={icons.offers} title="Active Offers" value={offers.length} linkTo="/admin/offers" />
                <StatCard icon={icons.categories} title="Menu Categories" value={menuCategories.length} linkTo="/admin/info" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mb-10">
                <h2 className="text-2xl font-bold text-coffee-dark mb-2">Menu Overview</h2>
                <p className="text-gray-600 mb-4">Number of dishes per category.</p>
                <PieChart data={menuByCategoryData} />
            </div>
        </div>
    );
};

export default AdminDashboardPage;