import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { ReservationItem } from '../types';

const AdminReservationsPage: React.FC = () => {
    const { reservations, updateReservation, deleteReservation } = useData();
    const [filter, setFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'Cancelled'>('Pending');

    const filteredReservations = reservations.filter(r => filter === 'All' || r.status === filter);

    const handleStatusChange = (reservation: ReservationItem, newStatus: ReservationItem['status']) => {
        updateReservation({ ...reservation, status: newStatus });
    };
    
    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this reservation permanently?")) {
            deleteReservation(id);
        }
    };

    const getStatusColor = (status: ReservationItem['status']) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            case 'Pending':
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    const filterButtons: ('All' | 'Pending' | 'Confirmed' | 'Cancelled')[] = ['Pending', 'Confirmed', 'Cancelled', 'All'];

    return (
        <div>
            <h1 className="text-3xl font-bold text-coffee-dark mb-6">Reservation Management</h1>
            
            <div className="mb-6 flex flex-wrap gap-2">
                {filterButtons.map(f => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${filter === f ? 'bg-coffee-brown text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-3">Date & Time</th>
                            <th className="text-left p-3">Customer</th>
                            <th className="text-left p-3">Guests</th>
                            <th className="text-left p-3">Status</th>
                            <th className="text-left p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReservations.map(res => (
                            <tr key={res.id} className="border-b">
                                <td className="p-3 whitespace-nowrap">
                                    <div className="font-semibold">{new Date(res.date).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                    <div className="text-sm text-gray-500">{res.time}</div>
                                </td>
                                <td className="p-3">
                                    <div className="font-semibold">{res.name}</div>
                                    <div className="text-sm text-gray-500">{res.phone}</div>
                                </td>
                                <td className="p-3">{res.guests}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(res.status)}`}>
                                        {res.status}
                                    </span>
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                    <select 
                                        value={res.status} 
                                        onChange={(e) => handleStatusChange(res, e.target.value as ReservationItem['status'])}
                                        className="mr-4 p-1 border rounded text-sm"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <button onClick={() => handleDelete(res.id)} className="text-red-600 hover:underline">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {filteredReservations.length === 0 && <p className="text-center text-gray-500 mt-8">No {filter !== 'All' ? filter.toLowerCase() : ''} reservations found.</p>}
        </div>
    );
};

export default AdminReservationsPage;