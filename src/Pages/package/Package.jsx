import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "./Package.css";
import PackageActions from "./buttonspackage/PackageActions.jsx";
import CreateButton from "./buttonspackage/CreateButton.jsx";
import Modal from "./views/Modalviewpackage.jsx";
import EditModal from "./views/EditModal.jsx";

function Package() {
    const [paquetes, setPaquetes] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [packagesPerPage] = useState(10);
    const [isTableView, setIsTableView] = useState(true);

    const apiUrl = "http://localhost:5000/paquetes";

    const fetchPaquetes = async () => {
        try {
            const response = await axios.get(apiUrl);
            setPaquetes(response.data);
        } catch (error) {
            console.error("Error al obtener datos del paquete:", error);
        }
    };

    useEffect(() => {
        fetchPaquetes();
    }, []);

    const handleView = (id) => {
        const selected = paquetes.find((paquete) => paquete.id === id);
        setSelectedPackage(selected);
        setIsModalOpen(true);
    };

    const handleCloseView = () => {
        setSelectedPackage(null);
        setIsModalOpen(false);
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: "¡No podrás revertir esto!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, eliminarlo",
            });

            if (result.isConfirmed) {
                await axios.delete(`http://localhost:5000/paquetes/${id}`);
                fetchPaquetes();
                Swal.fire("Eliminado", "El paquete ha sido eliminado.", "success");
            }
        } catch (error) {
            console.error("Error al eliminar el paquete:", error);
        }
    };

    const handleEdit = (id) => {
        const selected = paquetes.find((paquete) => paquete.id === id);
        setSelectedPackage(selected);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async (editedPackage) => {
        try {
            await axios.put(`${apiUrl}/${editedPackage.get("id")}`, editedPackage, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            fetchPaquetes();
        } catch (error) {
            console.error("Error al editar el paquete:", error);
        }
    };

    const handleCloseEdit = () => {
        setIsEditModalOpen(false);
    };

    const switchView = () => {
        setIsTableView((prevIsTableView) => !prevIsTableView);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfLastPackage = currentPage * packagesPerPage;
    const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
    const currentPackages = paquetes.slice(indexOfFirstPackage, indexOfLastPackage);

    return (
        <>
            <div className={`package-container ${isTableView ? "table-view" : "card-view"}`}>
                <div className="container">
                    <div className="content-info">
                        <div className="content-top">
                            <div className="options-left">
                                <CreateButton fetchPaquetes={fetchPaquetes} />
                            </div>
                            <div className="options-right">
                                <div className="option-list" onClick={switchView}>
                                    <i className="bx bx-menu"></i>
                                </div>
                                <div className="option-card" onClick={switchView}>
                                    <i className="bx bx-category"></i>
                                </div>
                            </div>
                        </div>

                        {isTableView ? (
                            <div className="content-body">
                                <table className="fixed-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Imagen</th>
                                            <th>Nombre</th>
                                            <th>Descripción</th>
                                            <th>Duración</th>
                                            <th>Estado</th>
                                            <th>Precio</th>
                                            <th>Opciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentPackages.map((paquete) => (
                                            <tr key={paquete.id}>
                                                <td>{paquete.id}</td>
                                                <td>
                                                    <img src={paquete.urlImagen} alt={paquete.nombre_paquete} />
                                                </td>
                                                <td>{paquete.nombre_paquete}</td>
                                                <td>{paquete.descripcion}</td>
                                                <td>{paquete.duracion} minutos</td>
                                                <td>{paquete.estado ? "Activo" : "Inactivo"}</td>
                                                <td>${paquete.precio}</td>
                                                <td>
                                                    <PackageActions
                                                        onView={() => handleView(paquete.id)}
                                                        onEdit={() => handleEdit(paquete.id)}
                                                        onDelete={() => handleDelete(paquete.id)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="content-body card-view-body">
                                {currentPackages.map((paquete) => (
                                    <div key={paquete.id} className="card">
                                        <img src={paquete.urlImagen} alt={paquete.nombre_paquete} />
                                        <div className="card-content">
                                            <h3>Nombre: {paquete.nombre_paquete}</h3>
                                            <p>Descripción: {paquete.descripcion}</p>
                                            <p>Duración: {paquete.duracion} minutos</p>
                                            <p>Estado: {paquete.estado ? "Activo" : "Inactivo"}</p>
                                            <p>Precio: ${paquete.precio}</p>
                                            <p>ID: {paquete.id}</p>
                                        </div>
                                        <PackageActions
                                            onView={() => handleView(paquete.id)}
                                            onEdit={() => handleEdit(paquete.id)}
                                            onDelete={() => handleDelete(paquete.id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="content-button">
                <ul className="pagination">
                    {Array.from({ length: Math.ceil(paquetes.length / packagesPerPage) }, (_, i) => (
                        <li key={i + 1} className={currentPage === i + 1 ? "active" : ""}>
                            <a onClick={() => paginate(i + 1)} href="#!">
                                {i + 1}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {isModalOpen && (
                <Modal onClose={handleCloseView}>
                    <h2>Detalles del Paquete</h2>
                    <p>ID: {selectedPackage.id}</p>
                    <p>Nombre: {selectedPackage.nombre_paquete}</p>
                    <p>Descripción: {selectedPackage.descripcion}</p>
                    <p>Duración: {selectedPackage.duracion} minutos</p>
                    <p>Estado: {selectedPackage.estado ? "Activo" : "Inactivo"}</p>
                    <p>Precio: ${selectedPackage.precio}</p>
                    <img src={selectedPackage.urlImagen} alt={selectedPackage.nombre_paquete} />
                </Modal>
            )}

            {isEditModalOpen && (
                <EditModal packageDetails={selectedPackage} onSave={handleSaveEdit} onClose={handleCloseEdit} />
            )}
        </>
    );
}
export default Package;