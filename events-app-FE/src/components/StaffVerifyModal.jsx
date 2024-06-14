import { useState } from "react";
import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from "@headlessui/react";
import { useUser } from "../UserContext.jsx";
import Loading from "./Loading";
import { staffVerify, setAsStaff } from "../api";

export default function StaffVerifyModal({ open, setOpen, setUser }) {
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [submitDisabled, setSubmitDisabled] = useState(false);
	const [loading, setLoading] = useState(false);

	const user = useUser();

	return (
		<Transition show={open}>
			<Dialog
				className="relative z-10"
				onClose={setOpen}
			>
				<TransitionChild
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</TransitionChild>

				<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<TransitionChild
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
								<form
									onSubmit={(e) => {
										e.preventDefault();
										staffVerify(password)
											.then((res) => {
												setPasswordConfirmation("Password correct.");
												setSubmitDisabled(true);
												setAsStaff(user.user_id)
													.then((res) => {
														location.reload();
													})
													.catch((err) => {
														setPasswordConfirmation("Something went wrong.");
														setTimeout(() => {
															setPasswordConfirmation("");
															setSubmitDisabled(false);
														}, 3000);
													});

												setTimeout(() => {
													setPasswordConfirmation("");
												}, 3000);
											})
											.catch((err) => {
												setPasswordConfirmation("Password incorrect.");
												setSubmitDisabled(true);

												setTimeout(() => {
													setPasswordConfirmation("");
													setSubmitDisabled(false);
												}, 3000);
											});
									}}
								>
									<label
										htmlFor="password"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Password
									</label>
									<div className="mt-2">
										<input
											type="password"
											name="password"
											id="password"
											disabled={submitDisabled}
											className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											placeholder=""
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										/>
									</div>
									<p
										className={
											"mt-2 text-sm" +
											(!passwordConfirmation ? "hidden" : "") +
											(passwordConfirmation == "Password correct."
												? " text-green-600"
												: " text-red-600")
										}
										id="password-error"
									>
										{passwordConfirmation}
									</p>
								</form>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}
