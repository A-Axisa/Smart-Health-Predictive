import { useState } from 'react';
import { createRoot } from 'react-dom/client';


const GenerateReportForm = () => {

	function handleSubmit(e) {
	}
	return (
		<div>
			<form method="post" className='mb-3 mt-3' onSubmit={handleSubmit}>
				<h2 className="text-center">Generate Health Report</h2>
				<hr />
				<div className='row'>
					<h4 className="text-center">Personal Information</h4>
					<div className='col-3 mb-3 mt-3'>
						{/* Personal Details Section */}
						<input type='text' name="firstName" className='form-control' placeholder='Enter your First Name'></input>
						<input type='text' name="lastName" className='form-control' placeholder='Enter your Last Name'></input>
					</div>

					<div className='col-3 mb-3 mt-3'>
						<input type='email' name="emailAddress" className='form-control' placeholder='Enter your email address'></input>
						<input type='text' name="contactNumber" className='form-control' placeholder='Enter your contact number'></input>
					</div>
				</div>

				<hr />
				{/* Age and Physique */}
				<div className='col-4 mb-3 mt-3'>
					<h4 className="text-center">Age & Physique</h4>
					<input type='text' name="age" className='form-control' placeholder='Enter your age'></input>
					<input type='text' name="weight" className='form-control' placeholder='Enter your weight'></input>
					<input type='text' name="height" className='form-control' placeholder='Enter you height'></input>
				</div>
				<hr />
				{/* Lifestyle */}
				<h3>LifeStyle</h3>
				<h4>Do you Drink Alcohol?</h4>
				<div className='col-3'>
					<div className="form-check">
						<input className="form-check-input" type="radio" name="Alcohol" id="alcoholYes" />
						<label className="form-check-label" for="alcoholYes">
							Yes
						</label>
					</div>
					<div className="form-check">
						<input className="form-check-input" type="radio" name="Alcohol" id="alcoholNo" />
						<label className="form-check-label" for="alcoholNo">
							No
						</label>
					</div>
					<h4>Are you a smoker?</h4>
					<div className='col-3'>
						<div className="form-check">
							<input className="form-check-input" type="radio" name="Smoker" id="smokerYes" />
							<label className="form-check-label" for="smokerYes">
								Yes
							</label>
						</div>
						<div className="form-check">
							<input className="form-check-input" type="radio" name="Smoker" id="smokerFormer" />
							<label className="form-check-label" for="smokerFormer">
								Former
							</label>

						</div>
						<div className="form-check">
							<input className="form-check-input" type="radio" name="Smoker" id="smokerNo" />
							<label className="form-check-label" for="smokerNo">
								No
							</label>

						</div>
					</div>
					{/* Fitness */}
					<h3>Fitness</h3>
					<h4>Exercise</h4>
					<div className='col-3'>
						<div className="form-check">
							<input className="form-check-input" type="radio" name="Exercise" id="exerciseYes" />
							<label className="form-check-label" for="exerciseYes">
								Yes
							</label>
						</div>
						<div className="form-check">
							<input className="form-check-input" type="radio" name="Exercise" id="exerciseNo" />
							<label className="form-check-label" for="exerciseNo">
								No
							</label>

						</div>
					</div>
					<h4>Hypertension</h4>
					<div className='col-3'>
						<div class="form-check">
							<input class="form-check-input" type="radio" name="Hypertension" id="hypertensionYes" />
							<label class="form-check-label" for="hypertensionYes">
								Yes
							</label>
						</div>
						<div class="form-check">
							<input class="form-check-input" type="radio" name="Hypertension" id="hypertensionNo" />
							<label class="form-check-label" for="hypertensionNo">
								No
							</label>
						</div>
					</div>

					<h4>Heart Disease</h4>
					<div className='col-3'>
						<div class="form-check">
							<input class="form-check-input" type="radio" name="HeartDisease" id="heartDiseaseYes" />
							<label class="form-check-label" for="heartDiseaseYes">
								Yes
							</label>
						</div>
						<div class="form-check">
							<input class="form-check-input" type="radio" name="HeartDisease" id="heartDiseaseNo" />
							<label class="form-check-label" for="heartDiseaseNo">
								No
							</label>
						</div>
					</div>

					<h4>Diabetes</h4>
					<div className='col-3'>
						<div class="form-check">
							<input class="form-check-input" type="radio" name="Diabetes" id="diabetesYes" />
							<label class="form-check-label" for="diabetesYes">
								Yes
							</label>
						</div>
						<div class="form-check">
							<input class="form-check-input" type="radio" name="Diabetes" id="diabetesNo" />
							<label class="form-check-label" for="diabetesNo">
								No
							</label>
						</div>
					</div>

					<div className='col-8 mb-3 mt-3'>
						<label>Blood Glucose (mmol/L)</label>
						<input type='text' name="bloodGlucose " className='form-control' placeholder='e.g. 5.5'></input>
					</div>

				</div>
				{/* Life Events */}
				<h3>Life Events</h3>
				<h4>Marital Status</h4>
				<div className='col-3'>
					<div className="form-check">
						<input className="form-check-input" type="radio" name="Marital Status" id="marMarried" />
						<label className="form-check-label" for="marMaried">
							Married
						</label>
					</div>
					<div className="form-check">
						<input className="form-check-input" type="radio" name="Marital Status" id="marSingle" />
						<label className="form-check-label" for="marSingle">
							Single
						</label>

					</div>
				</div>
				<h4>Working Status</h4>
				<div className='col-3'>
					<div className="form-check">
						<input className="form-check-input" type="radio" name="Working Status" id="workPrivate" />
						<label className="form-check-label" for="workPrivate">
							Private
						</label>

					</div>
					<div className="form-check">
						<input className="form-check-input" type="radio" name="Working Status" id="workPublic" />
						<label className="form-check-label" for="workPublic">
							Public
						</label>
					</div>

					<div className="form-check">
						<input className="form-check-input" type="radio" name="Working Status" id="workStudent" />
						<label className="form-check-label" for="workStudent">
							Student
						</label>

					</div>
					<div className="form-check">
						<input className="form-check-input" type="radio" name="Working Status" id="workUnemployed" />
						<label className="form-check-label" for="workUnemployed">
							Unemployed
						</label>

					</div>
				</div>
				<div className='col-3 mt-3'>
					<button className='btn btn-primary' type='submit'>Generate</button>
				</div>
			</form>

		</div>


	);
}


export default GenerateReportForm