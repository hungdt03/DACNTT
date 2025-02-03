import { FC, useState } from "react";
import CreateGroupSidebar, { CreateGroupForm } from "../../components/groups/components/CreateGroupSidebar";
import CreateGroupPreview from "../../components/groups/components/CreateGroupPreview";

const CreateGroupPage: FC = () => {
    const [values, setValues] = useState<CreateGroupForm>()
    return <div className="grid grid-cols-12 gap-4 w-full h-screen">
        <CreateGroupSidebar
            onChange={(values) => setValues(values)}
        />
        <div className="col-span-9 h-full overflow-hidden flex items-center justify-center py-10">
            <CreateGroupPreview values={values} />
        </div>
    </div>
};

export default CreateGroupPage;
