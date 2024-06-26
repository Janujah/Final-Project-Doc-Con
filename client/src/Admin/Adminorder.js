
import React, { useState, useEffect } from 'react';
import Navbar from './count'; // Ensure the component import matches the actual file name and path.

function UserTable() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15); // This does not change, so no setter is needed.
    const [editFormData, setEditFormData] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3001/order/orders');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
                alert('Failed to load users.');
            }
        };

        fetchUsers();

        const newSocket = new WebSocket('ws://localhost:3001');
        newSocket.onopen = () => {
            console.log('WebSocket connection established');
        };
        newSocket.onmessage = (event) => {
            setUsers(JSON.parse(event.data));
        };
        newSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        newSocket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            newSocket.close();
        };
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(users.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPageNumbers = () => {
        return [...Array(totalPages).keys()].map((number) => (
            <button key={number + 1} onClick={() => handlePageChange(number + 1)} disabled={currentPage === number + 1}>
                {number + 1}
            </button>
        ));
    };

    return (
        <div className="user-management-container">
            <Navbar />
            <div className="user-table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Address</th>
                            {/* <th>Gender</th> */}
                            {/* <th>Email</th> */}
                            <th>Phone</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((booking) => (
                            <tr key={booking._id}>
                                {/* <td>{booking.ProductId}</td> */}
                                <td>{booking.customerName}</td>
                                <td>{booking.address}</td>
                                {/* <td>{booking.email}</td> */}
                                <td>{booking.phoneNumber}</td>
                                <td>{new Date(booking.orderDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    {renderPageNumbers()}
                </div>
            </div>
        </div>
    );
}

export default UserTable;
