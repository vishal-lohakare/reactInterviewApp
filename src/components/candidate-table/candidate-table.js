import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.css';
import cellEditFactory from 'react-bootstrap-table2-editor';


const CandidateTable = (props) => {

    const { columns, data, keyField, loading, onTableChange, defaultSorted, mobile, paginationOptions, filter, noDataIndication, overlay } = props;

    const cellEdit = cellEditFactory({
        mode: mobile ? 'click' : 'dbclick'
    });

    return (
        <BootstrapTable
            remote={{ cellEdit: true }}
            keyField={keyField}
            data={data}
            columns={columns}
            cellEdit={cellEdit}
            loading={loading}
            onTableChange={onTableChange}
            striped
            hover
            noDataIndication={noDataIndication}
            overlay={overlay}
            defaultSorted={defaultSorted}
            pagination={paginationOptions}
            filter={ filter }
           
        />
    );
}

export default CandidateTable;