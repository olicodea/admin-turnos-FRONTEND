const clientesAPI = {
    async getAll(url) {
        const res = await fetch(url);
        const data = await res.json();
        return data;
    },
    async getOne(url) {
        const res = await fetch(url);
        const data = await res.json();

        return data;
    },
    async create(url, body) {
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        };

        const res = await fetch(url, options);
        const data = await res.json();

        return data;
    },
    async update(url, body){
        const options = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }

        const res = await fetch(url, options);
        const data = await res.json();

        return data;
    }
}

export default clientesAPI;