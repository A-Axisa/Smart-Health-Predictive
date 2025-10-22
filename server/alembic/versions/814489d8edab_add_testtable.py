"""Add TestTable

Revision ID: 814489d8edab
Revises: c7da9b40c87d
Create Date: 2025-10-14 23:05:06.285744

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '814489d8edab'
down_revision: Union[str, Sequence[str], None] = 'c7da9b40c87d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('TestTable',
    sa.Column('TestID', sa.Integer(), nullable=False),
    sa.Column('Name', sa.String(length=255)),
    sa.PrimaryKeyConstraint('TestID')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('TestTable')
