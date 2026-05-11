export function welcomeTemplate(user) {
	return `
        <div>
            <h1>Welcome to Avsaar</h1>

            <p>Hello ${user.full_name || "Student"},</p>

            <p>Welcome to the KIIT placement portal.</p>
        </div>
    `;
}
