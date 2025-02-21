import { FC, useState } from "react";
import CreateGroupSidebar, { CreateGroupForm } from "../../components/groups/components/CreateGroupSidebar";
import CreateGroupPreview from "../../components/groups/components/CreateGroupPreview";
import { Drawer } from "antd";


const CreateGroupPage: FC = () => {
    const [values, setValues] = useState<CreateGroupForm>();
    const [open, setOpen] = useState(false);

    return <div className="grid grid-cols-12 gap-4 w-full h-screen">
        <div className="h-full hidden lg:block lg:col-span-3 shadow overflow-y-hidden">
            <CreateGroupSidebar
                onChange={(values) => setValues(values)}
            />
        </div>

        <div className="col-span-12 lg:col-span-9 h-full overflow-hidden flex items-center justify-center py-10">
            <CreateGroupPreview
                onOpenDrawer={() => setOpen(true)}
                values={values}
            />
        </div>

        <Drawer onClose={() => setOpen(false)} open={open} title='TẠO NHÓM MỚI' className="hidden lg:block">
            <CreateGroupSidebar
                showHeader={false}
                onChange={(values) => setValues(values)}
            />
        </Drawer>
    </div>
};

export default CreateGroupPage;
