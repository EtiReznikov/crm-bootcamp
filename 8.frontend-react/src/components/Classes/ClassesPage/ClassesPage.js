import React, { useEffect, useState, useMemo } from 'react';
import Table from '../../SubComponents/Table/Table';
import axios from 'axios';
import Headline from '../../SubComponents/Headline/Headline';
import Button from '../../SubComponents/Button/Button';
import './ClassesPage.scss';
import Modal from 'react-modal';
import AddClass from '../AddClass/AddClass';
import ConfirmModal from '../../SubComponents/ConfirmModal/ConfirmModal';
import ErrorComponent from '../../SubComponents/ErrorComponenet/ErrorComponent';

function Classes(props) {
    const [data, setData] = useState([]);
    const [modalIsOpenAddClass, setIsOpenAddClassModal] = useState(false);
    const [modalIsOpenRemoveClass, setIsOpenRemoveClassModal] = useState(false);
    const [row, setRow] = useState("");
    const [dataHasChanged, setDataHasChanged] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [errorMsg, setError] = useState(false);
    const [ErrorDelete, setErrorDelete] = useState(false);

    const columns = useMemo(() => [
        {
            Header: "Class Name",
            accessor: "class_name",
        },
        {
            Header: 'Description',
            accessor: "description"
        },
        {
            Header: 'Days',
            accessor: "days"
        },
        {
            Header: 'Time',
            accessor: "time"
        },
        {
            Header: 'Update',
            width: '1em',
            Cell: ({ row }) => (
                <div id="row-button-wrapper">
                    <button className="row-button" onClick={() => {
                        openModalRemoveClass();
                        setRow(row.original);
                    }}>
                        {<i className="fa fa-trash"></i>}
                    </button>
                    <button className="row-button" onClick={() => {
                        setRow(row.original);
                        setIsEdit(true);
                        openModalAddClass();

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


    const openModalAddClass = () => {
        setIsOpenAddClassModal(true);
    }

    const closeModalAddClass = () => {
        setIsOpenAddClassModal(false);
    }

    const openModalRemoveClass = () => {
        setErrorDelete(false);
        setIsOpenRemoveClassModal(true);
    }

    const closeModalRemoveClass = () => {
        setIsOpenRemoveClassModal(false);
    }

    const DeleteClass = () => {
        axios.post('http://localhost:991/classes/removeClass/', {
            classId: row.class_id
        }).then(function (response) {
            if (response.data === true) {
                setErrorDelete(false);
                closeModalRemoveClass();
                changeDataState();
            }
            else {
                setErrorDelete(true);
            }


        })

            .catch(function (error) {
                setErrorDelete(true);
            });
    };


    useEffect(() => {
        (async () => {
            await axios.post('http://localhost:991/classes/getClasses/', {
                business_id: localStorage.getItem('business_id'),
            })
                .then((response) => {
                    if (response.data === "")
                        setData([]);

                    else if (Array.isArray(response.data)) {

                        setError(false)
                        let data = []
                        for (const classValue of response.data) {
                            let obj = JSON.parse(classValue.days_and_time)
                            let days = obj.days.join(', ')
                            let temp = {
                                class_id: classValue.class_id,
                                class_name: classValue.class_name,
                                description: classValue.description,
                                gym_id: classValue.gym_id,
                                color: classValue.color,
                                days: days,
                                time: obj.hours + ":" + obj.min
                            }
                            data.push(temp)
                        }
                        setData(data);
                    }
                    else {
                        setError(true);
                    }
                })
                .catch(function (error) {
                    setError(true);
                });
        })();
    }, [dataHasChanged]);

    const OnAddClassClick = () => {
        setIsEdit(false);
        openModalAddClass();
    }

    return (
        <div id="classes-page" className="page-wrapper">
            {!errorMsg &&
                <>
                    <div id="btn-head-wrapper">
                        <Headline id="client-page-head" text="Classes" />
                        <button className="add-row" onClick={OnAddClassClick}>
                            Add Class
                        </button>
                    </div>
                    <div id="table-wrapper">
                        {/* <div id="button-wrapper">
                            <Button
                                className="add-class-btn"
                                onClick={OnAddClassClick}
                                text={<i className="fa fa-calendar-plus-o"></i>}
                            />
                        </div> */}
                        <Table columns={columns} data={data} />
                    </div>
                    <Modal
                        isOpen={modalIsOpenAddClass}
                        onRequestClose={closeModalAddClass}
                        contentLabel="Add Class Modal"
                        className="modal"
                        ariaHideApp={false}
                    >
                        <AddClass closeModal={closeModalAddClass} changeDataState={changeDataState} classData={row} isEdit={isEdit} />
                    </Modal>
                    <Modal
                        isOpen={modalIsOpenRemoveClass}
                        onRequestClose={closeModalRemoveClass}
                        contentLabel="Remove Class Modal"
                        className="modal"
                        ariaHideApp={false}
                    >
                        <ConfirmModal onConfirm={DeleteClass} onDismiss={closeModalRemoveClass} text={`Are you sure you want to delete ${row.class_name}?`} errorMsg={ErrorDelete} />
                    </Modal>
                </>
            }
            {errorMsg &&
                <>
                    <Headline id="client-page-menu-header" text="Classes" />
                    <ErrorComponent text="Error" />
                </>
            }
        </div>
    )
}

export default Classes;