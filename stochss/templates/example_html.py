'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
'''

example_section = "<div>__CONTENTS__</div>"

example_entry = """
	<div class='mx-1'>
		<div class='row'>
			<div class='col-sm-3'>
				<h6><b>__NAME__</b></h6>
			</div>
			<div class='col-sm-5'>
				<p>__DESCRIPTION__</p>
			</div>
			<div class='col-sm-4'>
				<div class='row'>
					<div class='col-sm-6'>
						<a class='btn full-btn btn-outline-__NAV_ALERT__ box-shadow__NAV_STATUS__' href='__URL_BASE__/project-manager?path=__NAME__.proj' role='button'>
							<span>__NAV_TITLE__</span>
						</a>
					</div>
					<div class='col-sm-6'>
						<a class='btn full-btn btn-outline-__IMP_ALERT__ box-shadow' href='__URL_BASE__/?open=__OPEN_LINK__' role='button'>
							<span>__IMP_TITLE__</span>
						</a>
					</div>
					<div class='ml-5 mr-1 mt-3'>
						<span>__MOD_LABEL__: __MOD_DATE__</span>
					</div>
				</div>
			</div>
		</div>
	</div>
"""
