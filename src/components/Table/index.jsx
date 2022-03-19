import React from 'react'
import { Table,TableBody,TableCell,TableContainer
		,TableHead, TableRow,Paper,TableFooter,TablePagination } from '@material-ui/core';

import './style.css'
export class index extends React.Component {
	render() {
		return (
			<TableContainer component={Paper} className="table">
		      <Table sx={{ minWidth: 650 }} aria-label="simple table">
		        <TableHead>
		          <TableRow>
		            <TableCell className="tableCell">User</TableCell>
		            <TableCell className="tableCell">Since</TableCell>
		            <TableCell className="tableCell">Action</TableCell>
		          </TableRow>
		        </TableHead>
		        <TableBody>
		          <TableRow>
		          	<TableCell>
		          		<div>
		          			<img src="https://cdn.pixabay.com/photo/2022/02/14/08/53/woman-7012726_960_720.jpg" alt="avatar" />
							<span>Erwan</span>
		          		</div>
		          	</TableCell>
		          	<TableCell><span>22/12/93</span></TableCell>
		          	<TableCell><span>Block</span> | <span>Delete</span></TableCell>
		          </TableRow>
		        </TableBody>
		        <TableFooter>
		          <TableRow>
		            <TablePagination
		              rowsPerPageOptions={[10, { label: 'All', value: -1 }]}
		              colSpan={3}
		              count={15}
		              rowsPerPage={10}
		              page={1}
		              SelectProps={{
		                inputProps: {
		                  'aria-label': 'rows per page',
		                },
		                native: true,
		              }}
		            />
		          </TableRow>
		        </TableFooter>
		      </Table>
		    </TableContainer>
		)
	}
}

export default index