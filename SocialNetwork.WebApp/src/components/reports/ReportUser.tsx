import { FC } from "react";
import { ReportResource } from "../../types/report";

type ReportUserProps = {
    report: ReportResource
}

const ReportUser: FC<ReportUserProps> = ({
    report
}) => {
    return <div>ReportUser</div>;
};

export default ReportUser;
