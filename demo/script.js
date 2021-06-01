/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(
		[ 'N/record', 'N/search', 'N/format' ],

		function(record, search, format) {

			function beforeSubmit(scriptContext) {
				var rec = scriptContext.newRecord;
				var create_job = rec.getValue('custbody_no_next_approver');
				if (create_job == false) {
					try {
						var id = rec.id;
						var job_id_value = rec.getValue('custbody_job');
						log.debug({
							title : 'Akktest2',
							details : 'Job Value is ' + job_id_value
									+ '  ID is -->' + id,
						});

						if (id != null
								&& (job_id_value == '' || job_id_value == null)) {
							var salesOrderRecord = record.load({
								type : record.Type.SALES_ORDER,
								id : id,
								isDynamic : true,
							});
							var location = salesOrderRecord
									.getValue('location');// location == 90
							var department = salesOrderRecord
									.getValue('department');// Department == 8
							var subsidiary = salesOrderRecord
									.getValue('subsidiary');// Subsidiary == 14
							// log.debug({title: 'Akk Test 3',details: 'Location
							// is --> '+location + 'Department is --> '+
							// department,})
							var da = format.parse({
								value : salesOrderRecord.getValue('trandate'),
								type : format.Type.DATE
							});
							var month = da.getMonth() + 1; // month == 2
							var year = da.getFullYear();
							year = year.toString();
							var salerep = salesOrderRecord.getValue('salesrep');// sale
							// rep
							// ==
							// ''
							var company_name = salesOrderRecord
									.getValue('entity');
							var contract_date = salesOrderRecord
									.getValue('trandate');
							var total = salesOrderRecord.getValue('total'); // total
							// ==
							// 100.00
							var ref = id;
							var sale_type = salesOrderRecord
									.getValue('custbody_unit_sale_type');
							var parent_job = salesOrderRecord
									.getValue('custbody_machine');// get from
							// machine
							// record
							var parts_not_include = salesOrderRecord
									.getValue('custbody_parts_not_include');
							var engine_hour = salesOrderRecord
									.getValue('custbody_engine_hr');
							var machine_no = salesOrderRecord
									.getValue('custbody_machine');
							var job_type;
							var location_code1;
							var job_type_code1;
							var year_code1;
							var sub_code;
							if (subsidiary == 2) {
								sub_code = 1;
							} else if (subsidiary == 16) {
								sub_code = 2;
							} else if (subsidiary == 15) {
								sub_code = 3;
							} else if (subsidiary == 17) {
								sub_code = 4;
							}
							var num_branch = '';
							var branchnum;
							var location_rec = record.load({
								type : record.Type.LOCATION,
								id : location,
								isDynamic : true,
							});
							var num_branch = location_rec
									.getValue('custrecord_branchnum');
							var department_rec = record.load({
								type : record.Type.DEPARTMENT,
								id : department,
								isDynamic : true,
							});
							var department_code = department_rec
									.getValue('custrecord_deptnum');
							if (num_branch.toString().length < 2) {
								num_branch = num_branch.toString();
								branchnum = '0' + num_branch;
							} else {
								branchnum = num_branch.toString();
							}
							var project_name;
							if (sale_type == 13) {
								job_type = 1;
								project_name = 'PM';
							} else if (sales_type == 15) {
								job_type = 3;
								project_name = 'WR';
							} else if (sales_type == 16) {
								job_type = 4;
								project_name = 'REP';
							} else if (sale_type == 8 || sale_type == 9
									|| sale_type == 10 || sales_type == 11
									|| sale_type == 12) {
								job_type = 2;
								project_name = 'REV';
							}
							// log.debug({title: 'BeforeSearch ',details:
							// 'branch num is '+branchnum + ' JobType is '+
							// job_type+'year is '+year+'Subsidiary is '+
							// subsidiary,});
							var mySearch = search.create({
								type : search.Type.PROJECT_TASK,
								filters : [ search.createFilter({
									name : "custevent4",
									operator : search.Operator.ANY,
									values : branchnum
								}), search.createFilter({
									name : "custevent5",
									operator : search.Operator.ANYOF,
									values : job_type
								}), search.createFilter({
									name : "custevent6",
									operator : search.Operator.ANY,
									values : year
								}), search.createFilter({
									name : "custevent7",
									operator : search.Operator.ISNOTEMPTY
								}), search.createFilter({
									name : "custevent9",
									operator : search.Operator.ANYOF,
									values : subsidiary
								}), ],
								columns : [ 'custevent7' ]
							});
							var searchresultsakk = mySearch.run().getRange({
								start : 0,
								end : 50
							});
							var serialnum;
							var serial;
							if (searchresultsakk != null
									&& searchresultsakk.length != 0) {
								var a = searchresultsakk.length;
								log.debug({
									title : 'Test ',
									details : 'search length is ' + a,
								});
								for (var i = 0; i < searchresultsakk.length; i++) {
									var result = searchresultsakk[i];
									serialnum = result.getValue('custevent7');
								}
								serial = parseInt(serialnum) + 1;
								serialnum = serial;
								log
										.debug({
											title : 'Serial.Tostring ',
											details : 'SerialNumber.ToString . length is '
													+ serialnum.toString().length,
										});
								if (serialnum.toString().length == 1) {
									serialnum = serialnum.toString();
									serialnum = '00000' + serialnum;
								} else if (serialnum.toString().length == 2) {
									serialnum = serialnum.toString();
									serialnum = '0000' + serialnum;
								} else if (serialnum.toString().length == 3) {
									serialnum = serialnum.toString();
									serialnum = '000' + serialnum;
								} else if (serialnum.toString().length == 4) {
									serialnum = serialnum.toString();
									serialnum = '00' + serialnum;
								} else if (serialnum.toString().length == 5) {
									serialnum = serialnum.toString();
									serialnum = '0' + serialnum;
								} else {
									serialnum = serialnum.toString();
								}
							} else {
								serial = 1;
								serialnum = '000001';
							}
							var two_year = year.substring(2, 4);
							var project_task_name = project_name + sub_code
									+ branchnum + department_code + two_year
									+ serialnum;
							// log.debug({title:'Project Task Check ',details: '
							// Project Name is --> ' + project_name + '
							// Subsidiary code is --> ' + sub_code + ' Branch
							// NUm is --> ' + branchnum + ' Department is --> '
							// + department_code + 'Tw year is --> ' + two_year
							// + ' Serial Number is --> ' + serialnum + 'Parts
							// Not Include --> ' + parts_not_include,});
							var projectTask = record.create({
								type : record.Type.PROJECT_TASK,
							});

							var machine_record = record.load({
								type : record.Type.PROJECT_TASK,
								id : machine_no,
								idDynamic : true,
							});
							var machine_project_name = machine_record
									.getValue('company');

							projectTask.setValue('company',
									parseInt(machine_project_name));// Project
							// ID
							projectTask.setValue('title', project_task_name);// Project
							// Task
							// Name

							projectTask.setValue('custevent_location_tb_crm',
									location);// Location
							projectTask.setValue('parent', parent_job);// Parent
							// Task
							// ID
							projectTask
									.setValue('custevent_job_type', job_type);
							projectTask.setValue('custevent_subsidiary_tb_crm',
									subsidiary);// Subsidiary
							projectTask.setValue('status', 'PROGRESS');
							projectTask.setValue('custevent1', 5);// PJ Type
							// --> Job
							projectTask.setValue('plannedwork', 0);// 1*
							// Planned
							// work set
							// to 0
							projectTask.setValue('custevent_month', month);// Month
							projectTask.setValue('custevent_year', year);// Year
							projectTask.setValue('custevent_ref_invoice_no',
									ref);// REF Invoice No
							// custevent_ref_invoice_no
							projectTask.setValue('custevent_sales_person',
									salerep);// Sale Person
							projectTask.setValue('custevent_company_name',
									company_name); // Company
							projectTask.setValue('custevent_contract_date',
									contract_date);// Contract Date
							projectTask.setValue('custevent_engine_hr',
									engine_hour);

							projectTask.setValue('custevent4', branchnum);// new
							// crm
							// field
							projectTask.setValue('custevent5', job_type); // new
							// crm
							// field
							projectTask.setValue('custevent6', year);// ew
							// crm
							// field
							projectTask.setValue('custevent7', serialnum);
							projectTask.setValue('custevent9', subsidiary);
							projectTask.setValue('custevent_machine_new',
									parent_job);
							if (parts_not_include == true) {
								projectTask.setValue('custevent10', true);
							} else {
								projectTask.setValue('custevent10', false);
							}
							var jobId = projectTask.save({
								enableSourcing : true,
								ignoreMandatoryFields : true
							});
							rec.setValue('custbody_job', jobId);
						}
					} catch (e) {
						log.debug({
							title : 'DEBUG ',
							details : 'e' + e,
						});
					}
				}
			}
			return {
				beforeSubmit : beforeSubmit
			};
		});
