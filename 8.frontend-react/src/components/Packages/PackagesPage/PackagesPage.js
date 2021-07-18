import React, { useEffect, useState, useMemo } from 'react';
import Table from '../../SubComponents/Table/Table';
import axios from 'axios';
import Headline from '../../SubComponents/Headline/Headline';
import Button from '../../SubComponents/Button/Button';
import Modal from 'react-modal';
import AddPackage from '../AddPackage/AddPackage';
import ConfirmModal from '../../SubComponents/ConfirmModal/ConfirmModal';
import './PackagePage.scss'
function PackagesPage(props) {
    const [data, setData] = useState([]);
    const [modalIsOpenAddPackage, setIsOpenAddPackageModal] = useState(false);
    const [modalIsOpenRemovePackage, setIsOpenRemovePackageModal] = useState(false);
    const [row, setRow] = useState("");
    const [dataHasChanged, setDataHasChanged] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const columns = useMemo(() => [
        {
            Header: "Package Name",
            accessor: "package_name",
        },
        {
            Header: 'Price',
            accessor: "price"
        },

        {
            Header: 'UUpdate & Delete',
            width: '1em',
            Cell: ({ row }) => (
                <div id="row-button-wrapper">
                    <button className="row-button" onClick={() => {
                        openModalRemovePackage();
                        setRow(row.original);
                    }}>
                        {<i className="fa fa-trash"></i>}
                    </button>
                    <button className="row-button" onClick={() => {
                        setRow(row.original);
                        setIsEdit(true);
                        openModalAddPackage();

                    }}>
                        {<i className="fa fa-edit"></i>}
                    </button>
                </div>)
        },
    ], []
    );

    function changeDataState() {
        setDataHasChanged(!dataHasChanged);
    }


    const openModalAddPackage = () => {
        setIsOpenAddPackageModal(true);
    }

    const closeModalAddPackage = () => {
        setIsOpenAddPackageModal(false);
    }

    const openModalRemovePackage = () => {
        setIsOpenRemovePackageModal(true);
    }

    const closeModalRemovePackage = () => {
        setIsOpenRemovePackageModal(false);
    }

    const DeletePackage = () => {

        axios.post('http://localhost:991/packages/removePackage/', {
            packageId: row.package_id
        }).then(function (response) {
            closeModalRemovePackage();
            changeDataState();
            //TODO: handle error
        })

            .catch(function (error) {
                console.log(error)
            });
    };


    useEffect(() => {
        (async () => {
            await axios.post('http://localhost:991/packages/getPackages/', {
                business_id: localStorage.getItem('business_id'),
            })
                .then((response) => {
                    setData(response.data);
                })
                .catch(function (error) {

                });
        })();
    }, [dataHasChanged]);

    const OnAddPackageClick = () => {
        setIsEdit(false);
        openModalAddPackage();
    }

    return (
        <div id="package-page" className="page-wrapper">
            {
            // !errorMsg &&
                <>
                    <div id="btn-head-wrapper">
                        <Headline id="client-page-head" text="Packages" />
                        <button className="add-row" onClick={ OnAddPackageClick}>
                            Add Package
                        </button>
                    </div>

            <div id="table-wrapper">
                {/* <div id="button-wrapper">
                    <Button
                        className="add-class-btn"
                        onClick={
                            OnAddPackageClick
                        }
                        text={<i className="fa fa-calendar-plus-o"></i>}
                    />
                </div> */}
                <Table columns={columns} data={data} />
            </div>
            <Modal
                isOpen={modalIsOpenAddPackage}
                onRequestClose={closeModalAddPackage}
                contentLabel="Add Class Modal"
                className="modal"
                ariaHideApp={false}
            >
                <AddPackage closeModal={closeModalAddPackage} changeDataState={changeDataState} packageData={row} isEdit={isEdit} />
            </Modal>
            <Modal
                isOpen={modalIsOpenRemovePackage}
                onRequestClose={closeModalRemovePackage}
                contentLabel="Remove Package Modal"
                className="modal"
                ariaHideApp={false}
            >
                <ConfirmModal onConfirm={DeletePackage} onDismiss={closeModalRemovePackage} text={`Are you sure you want to delete ${row.class_name}?`}  />
            </Modal>
            </>
}
{/* {errorMsg &&
                <>
                    <Headline id="user-page-header" text="Clients" />
                    <ErrorComponent text="Error" />
                </>} */}
        </div>
    )
}

export default PackagesPage;