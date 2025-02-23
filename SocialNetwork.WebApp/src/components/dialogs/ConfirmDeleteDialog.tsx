// import React from 'react'
// import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'

// type ConfirmDeleteDialogProps = {
//     title: string
//     dialogOpen: boolean
//     deleteType: 'delete-all' | 'delete-selected' | 'lock-selected' | 'unlock-selected' | null
//     handleCloseDialog: () => void
//     handleConfirmDelete: () => void
// }

// const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
//     title,
//     dialogOpen,
//     deleteType,
//     handleCloseDialog,
//     handleConfirmDelete
// }) => {
//     return (
//         <Dialog open={dialogOpen} onClose={handleCloseDialog}>
//             <DialogTitle>Xác nhận</DialogTitle>
//             <DialogContent>
//                 <DialogContentText>
//                     {deleteType === 'delete-all'
//                         ? `Bạn có chắc chắn muốn xóa tất cả ${title}? Hành động này không thể hoàn tác.`
//                         : deleteType === 'lock-selected'
//                           ? `Bạn có chắc chắn muốn khóa các ${title} đã chọn? Hành động này không thể hoàn tác.`
//                           : deleteType === 'unlock-selected'
//                             ? `Bạn có chắc chắn muốn mở khóa các ${title} đã chọn? Hành động này không thể hoàn tác.`
//                             : `Bạn có chắc chắn muốn xóa các ${title} đã chọn? Hành động này không thể hoàn tác.`}
//                 </DialogContentText>
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={handleCloseDialog} color='secondary'>
//                     Hủy
//                 </Button>
//                 <Button onClick={handleConfirmDelete} color='error'>
//                     Đồng ý
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     )
// }

// export default ConfirmDeleteDialog
