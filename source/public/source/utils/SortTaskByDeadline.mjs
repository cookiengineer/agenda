
export const SortTaskByDeadline = (a, b) => {

	if (a.Deadline !== null && b.Deadline !== null) {

		if (a.Deadline < b.Deadline) return -1;
		if (b.Deadline < a.Deadline) return 1;

		return 0;

	} else if (a.Deadline !== null && b.Deadline === null) {

		return 1;

	} else if (b.Deadline !== null && a.Deadline === null) {

		return -1;

	} else if (a.Deadline === null && b.Deadline === null) {

		if (a.ID < b.ID) return -1;
		if (b.ID < a.ID) return 1;

		return 0;

	}

	return 0;

};
