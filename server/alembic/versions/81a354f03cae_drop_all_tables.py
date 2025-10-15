"""Drop All Tables

Revision ID: 81a354f03cae
Revises: 814489d8edab
Create Date: 2025-10-14 23:37:18.679763

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '81a354f03cae'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_table("RolePermission", if_exists=True)
    op.drop_table("UserAccountRole", if_exists=True)
    op.drop_table("Recommendation", if_exists=True)
    op.drop_table("Prediction", if_exists=True)
    op.drop_table("HealthData", if_exists=True)
    op.drop_table("UserAccountValidationToken", if_exists=True)
    op.drop_table("Permission", if_exists=True)
    op.drop_table("AccountRole", if_exists=True)
    op.drop_table("UserAccount", if_exists=True)
    op.drop_table("TestTable", if_exists=True)


def downgrade() -> None:
    """Downgrade schema."""
    pass
