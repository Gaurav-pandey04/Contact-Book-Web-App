import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

export async function loader({ params }){
    const contact = await getContact(params.contactId);
    if(!contact){
        throw new Response("", {
            status: 404,
            statusText: "Contact not found",
        });
    }
    return contact;
}

export async function action({ request, params }){
    let formData = await request.formData();
    return updateContact(params.contactId, {
        favorite: formData.get('favorite') === "true",
    });
}

const contact = () => {
   const contact = useLoaderData();

    const Favorite = ({ contact }) => {
        const fetcher = useFetcher();
        let favorite = contact.favorite;
        if(fetcher.formData){
            favorite = fetcher.formData.get("favorite") === "true";
        }

        return (
            <fetcher.Form method="post">
                <button
                name="favorite"
                value={favorite ? "false" : "true"}
                aria-label={
                    favorite ? "Remove from Favorite" : "Add to Favorite"
                }>
                    {favorite ? "★" : "☆"}
                </button>
            </fetcher.Form>
        );
    }

    return (
        <div id="contact">
            <div>
                <img 
                key={contact.avatar}
                src={contact.avatar || null}
                />
            </div>

            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                        {contact.first} {contact.last}
                        </>
                    ):(
                        <i>No Name</i>
                    )}{" "}
                    <Favorite contact={contact}/>
                </h1>

                {contact.twitter && (
                    <p>
                        <a
                         target="_blank"
                         href={`https://twitter.com/${contact.twitter}`}
                        >
                            {contact.twitter}
                        </a>
                    </p>
                )}

                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    <Form action="edit"> 
                        <button type="submit">Edit</button>
                    </Form>
                    <Form 
                    method="post"
                    action="destroy"
                    onSubmit={(e)=>{
                        if(
                            !confirm(
                                "Please Confirm you want to delete this record"
                            )
                        ){
                            e.preventDefault();
                        }
                    }}
                    > 
                    <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default contact;