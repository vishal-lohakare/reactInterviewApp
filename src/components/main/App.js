import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.scss';
import { bindActionCreators } from 'redux';
import getCandidates, { updateTestScore, updateL1Score, updateL1Status, updateGKScore, updateGKStatus } from "../../actions/actions";
import CandidateTable from '../candidate-table/candidate-table';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import moment from 'moment';
import _ from 'underscore';
import paginationFactory from 'react-bootstrap-table2-paginator';
import overlayFactory from 'react-bootstrap-table2-overlay';
import timer, { scoreValidation } from '../common/utility';
import Field from '../common/Field';
import Button from '../common/Button';
import Constants from '../constants/constants';

const mapStateToProps = function (store) {
	return { candidates: store.candidatesRed.candidates }
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		getCandidates: getCandidates,
		updateTestScore: updateTestScore,
		updateL1Score: updateL1Score,
		updateL1Status: updateL1Status,
		updateGKScore: updateGKScore,
		updateGKStatus: updateGKStatus
	}, dispatch);
}

class App extends Component {

	constructor(props) {
		super(props);

		
		

		const startStopInterview = (column, scoreValue, id) => {

			let updatedData = this.state.data.map(row => {
				if (row.emailId === id) {
					if (scoreValue === null) {
						row[column.columnType]["startTime"] = moment().format(Constants.DATE_FORMAT);
					} else {
						row[column.columnType]["endTime"] = moment().format(Constants.DATE_FORMAT);
					}
				}
				return row;
			});

			if (scoreValue !== 0) {
				let temp = {
					cellEdit: {
						dataField: column.columnType + "." + column.columnField,
						rowId: id,
						newValue: scoreValue ? scoreValue : 0
					},
					data: updatedData
				}

				if (column.columnType === "l1Details") {
					this.props.updateL1Status(temp);
				} else {
					this.props.updateGKStatus(temp);
				}
			}
		}

		const candidateName = (cell, rowData) => {
			return (<Field className="candidateName" text={rowData.name} />);
		};

		const columnFormatter = (cell, rowData, rowIdx, extraFormatData) => {

			if (extraFormatData.columnType === "testDetails") {
				switch (extraFormatData.columnField) {
					case "score":
						if (rowData.testDetails.score !== null) {
							return (<Field className="score_style" text={rowData.testDetails.score} />);
						} else {
							return (<Field text={Constants.BLANK_SCORE_TEXT} />);
						}
					case "status":
						if (rowData.testDetails.score === null) {
							return (<Field className="na-style" text={Constants.NA} />);
						} else if (rowData.testDetails.score < Constants.PASS_THRESHOLD) {
							return (<Field className="rejected" text={Constants.REJECTED} renderTextAfterChild="false"><i className="fas fa-times-circle"></i></Field>);
						} else {
							return (<Field className="selected" text={Constants.SELECTED} renderTextAfterChild="false"><i className="fas fa-times-circle"></i></Field>);
						}
					default: break;
				};
			}

			if (extraFormatData.columnType === "l1Details") {
				switch (extraFormatData.columnField) {
					case "score":
						if (rowData.testDetails.score >= Constants.PASS_THRESHOLD) {
							if (rowData.l1Details.startTime.length === 0) {
								return (
									<Button
										className="btn btn-primary btn-sm"
										text={Constants.SCHEDULE_L1}
										onClick={() => { startStopInterview(extraFormatData, rowData.l1Details.score, rowData.emailId) }}
									/>
								);
							} else if (rowData.l1Details.startTime.length !== 0 && rowData.l1Details.endTime.length === 0) {
								return (
									<Button
										className="btn btn-primary btn-sm"
										text={Constants.FINISH_INTERVIEW}
										onClick={() => { startStopInterview(extraFormatData, rowData.l1Details.score, rowData.emailId) }}
									/>
								);
							} else {
								return (<Field className="score_style" text={rowData.l1Details.score} />);
							}
						} else {
							return (<Field className="na-style" text={Constants.NA} />);
						}
					case "status":

						if (rowData.testDetails.score >= Constants.PASS_THRESHOLD && rowData.l1Details.score !== null) {

							if (rowData.l1Details.startTime.length !== 0 && rowData.l1Details.endTime.length === 0) {
								return (
									<Field className="small" text={Constants.STARTED_AT}>
										<br /> <i className="far fa-clock"></i> {moment(rowData.l1Details.startTime).format(Constants.COMPACT_DATE_FORMAT)}
									</Field>
								);
							} else if (rowData.l1Details.score >= Constants.PASS_THRESHOLD) {
								return (
									<Field className="small" text={Constants.SELECTED_IN}>
										<br /> <i className="far fa-clock"></i> {timer(rowData.l1Details.startTime, rowData.l1Details.endTime)} {Constants.MINUTES}
									</Field>
								);
							} else {
								return (
									<Field className="small" text={Constants.REJECTED_IN}>
										<br /> <i className="far fa-clock"></i> {timer(rowData.l1Details.startTime, rowData.l1Details.endTime)} {Constants.MINUTES}
									</Field>
								);
							}
						} else {
							return (<Field className="na-style" text={Constants.NA} />);
						}
					default: break;
				}

			}

			if (extraFormatData.columnType === "gkDetails") {
				switch (extraFormatData.columnField) {
					case "score":
						if (rowData.l1Details.score >= Constants.PASS_THRESHOLD) {
							if (rowData.gkDetails.startTime.length === 0) {
								return (
									<Button
										className="btn btn-primary btn-sm"
										text={Constants.SCHEDULE_GK}
										onClick={() => { startStopInterview(extraFormatData, rowData.gkDetails.score, rowData.emailId) }}
									/>
								);
							} else if (rowData.gkDetails.startTime.length !== 0 && rowData.gkDetails.endTime.length === 0) {
								return (
									<Button
										className="btn btn-primary btn-sm"
										text={Constants.FINISH_INTERVIEW}
										onClick={() => { startStopInterview(extraFormatData, rowData.gkDetails.score, rowData.emailId) }}
									/>
								);
							} else {
								return (<Field className="score_style" text={rowData.gkDetails.score} />);
							}
						} else {
							return (<Field className="na-style" text={Constants.NA} />);
						}
					case "status":
						if (rowData.l1Details.score >= Constants.PASS_THRESHOLD && rowData.gkDetails.score !== null) {

							if (rowData.gkDetails.startTime.length !== 0 && rowData.gkDetails.endTime.length === 0) {
								return (
									<Field className="small" text={Constants.STARTED_AT}>
										<br /> <i className="far fa-clock"></i> {moment(rowData.gkDetails.startTime).format(Constants.COMPACT_DATE_FORMAT)}
									</Field>
								);
							} else if (rowData.gkDetails.score >= Constants.PASS_THRESHOLD) {
								return (
									<Field className="small" text={Constants.SELECTED_IN}>
										<br /> <i className="far fa-clock"></i> {timer(rowData.gkDetails.startTime, rowData.gkDetails.endTime)} {Constants.MINUTES}
									</Field>
								);
							} else {
								return (
									<Field className="small" text={Constants.REJECTED_IN}>
										<br /> <i className="far fa-clock"></i> {timer(rowData.gkDetails.startTime, rowData.gkDetails.endTime)} {Constants.MINUTES}
									</Field>
								);
							}
						} else {
							return (<Field className="na-style" text={Constants.NA} />);
						}
					default: break;
				}

			}

			if (extraFormatData.columnType === "finalResult") {
				switch (extraFormatData.columnField) {
					case "status":
						if (rowData.testDetails.score !== null) {
							if (rowData.testDetails.score < Constants.PASS_THRESHOLD) {
								//test reject
								return (<Field className="score_style" text={Constants.TEST_REJECTED} />);
							} else {
								//test selected
								if (rowData.l1Details.score !== null) {
									if (rowData.l1Details.score === 0) {
										//l1 in progress
										return (<Field className="score_style" text={Constants.L1_IN_PROGRESS} />);
									} else if (rowData.testDetails.score < Constants.PASS_THRESHOLD && rowData.l1Details.endTime.length !== 0) {
										//l1 reject
										return (<Field className="score_style" text={Constants.L1_REJECTED} />);
									} else {
										// l1 selected
										if (rowData.gkDetails.score !== null) {
											if (rowData.gkDetails.score === 0) {
												//gk in progress
												return (<Field className="score_style" text={Constants.GK_IN_PROGRESS} />);
											} else if (rowData.gkDetails.score < Constants.PASS_THRESHOLD && rowData.gkDetails.endTime.length !== 0) {
												//gk reject
												return (<Field className="score_style" text={Constants.GK_REJECTED} />);
											} else if (rowData.gkDetails.score !== null) {
												// gk selected
												return (<Field className="score_style" text={Constants.GK_SELECTED} />);
											}
										}
										return (<Field className="score_style" text={Constants.L1_SELECTED} />);
									}
								}
								return (<Field className="score_style" text={Constants.TEST_SELECTED} />);
							}
						} else {
							return (<Field className="score_style na-style" text={Constants.NA} />);
						}
					case 'seniority':
						if (!rowData.gkDetails.score || rowData.gkDetails.score < Constants.PASS_THRESHOLD) {
							return (<Field className="score_style na-style" text={Constants.NA} />);
						} else {
							return (<Field className="score_style" text={rowData.finalResult.seniority} />);
						}
					default: break;
				}
			}
		};

		this.handleTableChange = this.handleTableChange.bind(this);

		this.columns = [{
			dataField: 'name',
			text: Constants.NAME,
			formatter: candidateName,
			sort: true,
			editable: false,
			filter: textFilter()
		}, {
			dataField: 'experience',
			text: Constants.EXPERIENCE,
			sort: true,
			editable: false,
			filter: textFilter()
		}, {
			dataField: 'testDetails.score',
			text: Constants.TEST_SCORE,
			sort: true,
			validator: scoreValidation,
			editCellClasses: (cell, row) => {
				return (cell < Constants.MIN_SCORE || cell > Constants.MAX_SCORE) ? 'has-error' : 'has-success';
			},
			formatter: columnFormatter,
			formatExtraData: {
				"columnType": "testDetails",
				"columnField": "score"
			},
			filter: textFilter()

		}, {
			dataField: 'testDetails.startTime',
			text: Constants.TEST_STATUS,
			sort: true,
			editable: false,
			formatter: columnFormatter,
			formatExtraData: {
				"columnType": "testDetails",
				"columnField": "status"
			}
		}, {
			dataField: 'l1Details.score',
			text: Constants.L1_SCORE,
			sort: true,
			validator: scoreValidation,
			editable: (content, rowData) => {
				return rowData.testDetails.score >= Constants.PASS_THRESHOLD;
			},
			formatter: columnFormatter,
			formatExtraData: {
				"columnType": "l1Details",
				"columnField": "score"
			}
		}, {
			dataField: 'l1Details.startTime',
			text: Constants.L1_STATUS,
			sort: true,
			editable: false,
			formatter: columnFormatter,
			formatExtraData: {
				"columnType": "l1Details",
				"columnField": "status"
			}
		}, {
			dataField: 'gkDetails.score',
			text: Constants.GK_SCORE,
			sort: true,
			validator: scoreValidation,
			editable: (content, rowData) => {
				return rowData.l1Details.score !== null && rowData.testDetails.score >= Constants.PASS_THRESHOLD
					&& rowData.l1Details.score >= Constants.PASS_THRESHOLD;
			},
			formatter: columnFormatter,
			formatExtraData: {
				"columnType": "gkDetails",
				"columnField": "score"
			}
		}, {
			dataField: 'gkDetails.startTime',
			text: Constants.GK_STATUS,
			sort: true,
			editable: false,
			formatter: columnFormatter,
			formatExtraData: {
				"columnType": "gkDetails",
				"columnField": "status"
			}
		}, {
			dataField: 'finalResult.status',
			text: Constants.FINAL_STATUS,
			sort: true,
			editable: false,
			formatter: columnFormatter,
			formatExtraData: {
				"columnType": "finalResult",
				"columnField": "status"
			}
		}, {
			dataField: 'finalResult.seniority',
			text: Constants.SENIORITY,
			sort: true,
			editable: (content, rowData) => {
				return rowData.gkDetails.score >= Constants.PASS_THRESHOLD;
			},
			formatter: columnFormatter,
			formatExtraData: {
				"columnType": "finalResult",
				"columnField": "seniority"
			}
		}];

		this.defaultSorted = [{
			dataField: 'name',
			order: 'asc'
		}];

		
		//pagination constant options...
		this.paginationOptions = paginationFactory({
			paginationSize: Constants.DEFAULT_PAGE_SIZE,
			pageStartIndex: Constants.START_PAGE_INDEX,
			firstPageText: Constants.PAGINATION_NEXT_TEXT,
			prePageText: Constants.PAGINATION_PREVIOUS_TEXT,
			nextPageText: '>',
			lastPageText: '<',
			sizePerPageList: Constants.SIZE_PER_PAGE_LIST //Dropdown pagination option to show no of records per page 
		});

		this.state = {
			loading: true,
			mobile: false
		};

		this.overlay = overlayFactory({ spinner: true, background: Constants.SPINNER_COLOR })

	}

	handleTableChange(eventType, { cellEdit, data }) {

		if (eventType === 'cellEdit') {
			let column = cellEdit.dataField.split(".")[0];

			switch (column) {
				case "testDetails":
					this.props.updateTestScore({
						cellEdit: cellEdit
					});
					break;
				case "l1Details":
					this.props.updateL1Score({
						cellEdit: cellEdit
					});
					break;
				case "gkDetails":
					this.props.updateGKScore({
						cellEdit: cellEdit
					});
					break;
				default: break;
			}
		}
	}

	componentDidMount() {
		this.props.getCandidates();
		_.debounce(window.addEventListener("resize", this.resize.bind(this)), 1000);
		this.resize();
	}

	resize() {
		this.setState({ mobile: window.innerWidth <= 1024 });
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			data: nextProps.candidates,
			loading: false
		});
	}

	render() {
		return (

			<div className="container main">
				<div className="row">
					<div className="col-md-12">
						<h1 className="heading">{Constants.APP_TITLE}</h1>
						<hr />
					</div>
				</div>
				<div className="row">
					<div className="col-md-12">
						<CandidateTable
							columns={this.columns}
							data={this.state.data}
							keyField='emailId'
							loading={this.state.loading}
							onTableChange={this.handleTableChange}
							defaultSorted={this.defaultSorted}
							noDataIndication={() => {
								if (!this.state.loading && this.state.data.length === 0) {
									return (<div className="noData">{Constants.EMPTY_TABLE_TEXT}</div>);
								}
							}}
							overlay={this.overlay}
							mobile={this.state.mobile}
							paginationOptions={this.paginationOptions}
							filter={filterFactory()}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
