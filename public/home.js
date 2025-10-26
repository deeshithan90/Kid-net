const loaddata = async ()=>{
    try {
        const res = await fetch("/api/profile");
        const data = await res.json();
                if (!data.ok) {
          var index = document.writeln(`
            <h1>error file not found not login</h1>
        `)
        }

        const u = data.user;
        document.getElementById("profile").innerHTML = `
                    <p>Kid: ${u.kidName}</p>
        `;
    } catch (error) {
        console.log(error)
    }
}   
loaddata()